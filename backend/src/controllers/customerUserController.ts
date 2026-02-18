import asyncHandler from 'express-async-handler'
import { Response, Request } from 'express'
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js'
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from '../mailtrap/emails.js'
import PendingUser from '../models/pendingUserModel.js'
import sanitizeUser from '../utils/sanitizeUser.js'
import { AppError } from '../types/appError.js'
import { UserDocument } from '../types/userTypes.js'
import axios from 'axios'
import DEMO_CREDENTIALS from '../consts/demoCredentials.js'

// POST /
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, recaptchaToken } = req.body

    if (!name || !email || !password) {
      res.status(400)
      throw new Error('Por favor rellena todos los campos')
    }

    if (!recaptchaToken) {
      res.status(400)
      throw new Error('Captcha requerido')
    }

    // Verify google reCAPTCHA V2
    const secret = process.env.RECAPTCHA_SECRET_KEY || process.env.RECAPTCHA_SECRET_LOCALHOST_KEY
    const { data } = await axios.post(`https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret,
          response: recaptchaToken,
        }
      }
    )

    if (!data.success && email !== DEMO_CREDENTIALS.email) {
      res.status(401)
      throw new Error('Captcha inválido. Intenta nuevamente')
    }

    // Check if user email exists
    const userExists = await PendingUser.findOne({ email }) || await User.findOne({ email })

    if (userExists) {
      res.status(400)
      throw new Error('Este correo ya está registrado')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Generate verification token
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString()

    const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 Minutes

    // Create pending user
    const pendingUser = new PendingUser({
      email,
      password: hashedPassword,
      name,
      verificationCode,
      verificationCodeExpiresAt, 
    })

    // Send verification email
    try {
      await sendVerificationEmail(pendingUser.email, verificationCode)

      await pendingUser.save()
    } catch (error) {
      res.status(500)
      throw new Error('Sistema de envío de correos no habilitado')
    }
    
    res.status(200).json({ message: 'Correo de verificación enviado exitosamente'})
  }
)

// POST /verify-email
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.body

  const pendingUser = await PendingUser.findOne({ verificationCode: code })
  
  if (!pendingUser || pendingUser.verificationCode !== code) {
    res.status(400)
    throw new Error('Código de verificación inválido o ya expiró')
  }

  // Create a verified user in users document
  const user = await User.create({
    email: pendingUser.email,
    password: pendingUser.password,
    name: pendingUser.name,
  })

  // Delete from pending users
  await pendingUser.deleteOne({ verificationCode: code })

  // JWT Sign
  generateTokenAndSetCookie(res, user._id)
  
  await sendWelcomeEmail(user.email, user.name)

  res.status(200).json({
    message: 'Correo verificado exitosamente',
    user: sanitizeUser(user),
  })
})

// POST /login
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, recaptchaToken } = req.body

  if (!recaptchaToken) {
    res.status(401)
    throw new Error('Captcha inválido. Intenta nuevamente')
  }

  if (!email || !password) {
    res.status(401)
    throw new Error('Usuario e email requeridos')
  }

  // Verify google reCAPTCHA V2
  const secret = process.env.RECAPTCHA_SECRET_KEY || process.env.RECAPTCHA_SECRET_LOCALHOST_KEY
  const { data } = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`,
    null,
    {
      params: {
        secret,
        response: recaptchaToken,
      },
    }
  )

  if (!data.success && email !== DEMO_CREDENTIALS.email) {
    res.status(403)
    throw new Error('Verificación de CAPTCHA fallida')
  }

  // Get user by email in DB
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    generateTokenAndSetCookie(res, user._id)

    user.lastLogin = new Date()
    await user.save()

    res.status(200).json({
      message: 'El usuario ha iniciado sesión exitosamente',
      user: sanitizeUser(user),
    })
  } else {
    res.status(400)
    throw new Error('Credenciales inválidas')
  }
})

// POST /logout
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, userId } = req.body

  if (email === DEMO_CREDENTIALS.email) {
    await User.findByIdAndUpdate(userId, {
      name: 'Wardo Demo User',
      cart: {
        items: []
      }, 
      addresses: [],
    })
  }

  const isProduction = process.env.NODE_ENV === 'production'

  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  })

  res.status(200).json({ message: 'El usuario ha salido de sesión exitosamente' })
})

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Display user data' })
})

// POST /forgot-password
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body

    if (!email) {
      res.status(400)
      throw new Error('Email requerido')
    }

    const user = await User.findOne({ email: email })

    if (!user) {
      res.status(400)
      throw new Error('No existe cuenta asociada a este correo')
    }

    if (user.resetPasswordToken) {
      res.status(401)
      throw new Error('Ya se ha enviado un código recientemente a este correo')
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex')
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 Hour

    user.resetPasswordToken = resetToken
    user.resetPasswordExpiresAt = resetTokenExpiresAt

    await user.save()

    try {
      // Send email
      await sendPasswordResetEmail(
        email,
        `${process.env.CLIENT_URL}/reset-password/${resetToken}`
      )

      res
        .status(200)
        .json({
          message: 'Se ha enviado un correo a ',
          email,
        })
    } catch (error: any) {
      res.status(error.statusCode || 500)
      throw new Error(error.message)
    }
  }
)

// POST /reset-password/
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { password } = req.body
    const user = req.user as UserDocument

    // Update password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    user.password = hashedPassword
    user.resetPasswordExpiresAt = undefined
    user.resetPasswordToken = undefined

    await user.save()

    await sendResetSuccessEmail(user.email)

    res.status(200).json({ message: 'Contraseña cambiada exitosamente'})
  }
)

// /POST Check password token
export const checkPasswordToken = asyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json({
      message: 'Token validado correctamente',
    })
  }
)

export const checkAuth = asyncHandler( async (req: Request, res: Response) => {
  const user = req.user

  if (!user) throw new Error('Error al autentificar el usuario')

  res.status(200).json({ message: 'El usuario está autenticado correctamente', user})
})

export const changeName = asyncHandler( async (req: Request, res: Response) => {
  const { userId } = req.params
  const newName = req.body.name

  if (!newName) {
    throw new Error('Nombre ingresado no válido')
  }

  const user = await User.findById(userId)

  if (!user) {
    res.status(404)
    throw new Error('Usuario no encontrado')
  }

  if (user.name === newName) {
    res.status(401)
    throw new Error('El nombre ingresado es igual al actual')
  }

  // Update name
  user.name = newName
  user.save()

  res.status(200).json({
    message: 'Nombre de usuario actualizado exitosamente',
    name: newName,
  })
})

export const changePassword = asyncHandler(async (req: Request, res: Response) =>{
  const { userId } = req.params
  const { currentPass, newPass } = req.body

  const user = await User.findById(userId)

  if (!user) {
    res.status(404)
    throw new AppError('Usuario no encontrado', 'USER_NOT_FOUND')
  }

  if (!currentPass || !newPass) {
    res.status(400)
    throw new AppError('Contraseña actual y nueva requeridas', 'FIELDS_REQUIRED')
  }

  if (await bcrypt.compare(currentPass, user.password)) {

    if (await bcrypt.compare(newPass, user.password)) {
      res.status(401)
      throw new AppError('La nueva contraseña debe ser distinta a la actual',
        'SAME_PASSWORD'
      )
    }

    // Update password to hashed new password
    const salt = await bcrypt.genSalt(10)
    const hashedNewPass = await bcrypt.hash(newPass, salt)
    user.password = hashedNewPass
    user.save()

    res.status(200).json({
      message: 'Contraseña actualizada correctamente',
      user: sanitizeUser(user),
    })
  } else {
    res.status(401)
    throw new AppError('Contraseña incorrecta', 'INCORRECT_PASSWORD')
  }
})

export const changeAddress = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params
  const newAddress = req.body

  if (!userId || !newAddress) {
    res.status(404)
    throw new Error('Usuario o dirección no válida')
  }

  // Find addresses on the specified user
  const userAddresses = await User.findById(userId).select('addresses')

  if (!userAddresses) {
    res.status(404)
    throw new Error('Usuario no encontrado')
  }

  const address = userAddresses.addresses.find((address) => address._id.toString() === newAddress._id)

  if (!address) {
    res.status(404)
    throw new Error('Dirección no encontrada')
  }

  // Replace the address with newAddress, including deep nested properties
  Object.assign(address, {
    ...newAddress,
    addressInfo: { ...newAddress.addressInfo }
  })

  await userAddresses.save()

  res.status(200).json({
    message: 'Dirección actualizada exitosamente',
    addresses: userAddresses.addresses,
  })
})

export const changeMainAddress = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const { newMainId } = req.body

  const user = await User.findById(userId)
  if (!user) {
    res.status(404)
    throw new Error('Usuario no encontrado')
  }

  user.addresses.forEach((address) => {
    address.isMain = address._id.toString() === newMainId
  })

  await user.save()

  res.status(200).json({ addresses: user.addresses })
})


export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const { userId, addressId } = req.params

  if (!userId || !addressId) {
    res.status(404)
    throw new Error('Error al procesar la dirección')
  }

  const user = await User.findById(userId)

  if (!user) {
    res.status(404)
    throw new Error('Usuario no encontrado')
  }

  const filteredAddresses = user.addresses.filter((address) => address._id.toString() !== addressId)

  user.addresses = filteredAddresses
  user.save()

  res.status(200).json({
    message: 'Dirección eliminada exitosamente',
    addresses: user.addresses,
  })

})

export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params
  const address = req.body

  if (!userId || !address) {
    res.status(401)
    throw new Error('Usuario y dirección requeridos')
  }

  const user = await User.findById(userId)

  if (!user) {
    res.status(404)
    throw new Error('Usuario no encontrado')
  }

  // Set first added address as main
  if (user.addresses.length === 0) {
    address.isMain = true
  } else {
    address.isMain = false
  }

  user.addresses.push(address)
  user.save()

  res.status(200).json({
    message: 'Dirección añadida exitosamente',
    addresses: user.addresses,
  })
})

export const loginDemo = asyncHandler(async (req: Request, res: Response) => {
  const email = process.env.DEMO_EMAIL
  const password = process.env.DEMO_PASSWORD || ''
  console.log('🌍 Request origin:', req.headers.origin)
  console.log('🔑 Setting cookie for origin:', req.headers.origin)
  

  const user = await User.findOne({ email })
  if (!user) {
    res.status(401)
    throw new Error('Usuario demo no encontrado')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    res.status(401)
    throw new Error('Credenciales demo inválidas')
  }

  // Update last login
  user.lastLogin = new Date()
  await user.save()

  generateTokenAndSetCookie(res, user._id)
  
  res.status(200).json({
    mesage: 'Usuario demo ha iniciado sesión',
    user: sanitizeUser(user),
  })
})