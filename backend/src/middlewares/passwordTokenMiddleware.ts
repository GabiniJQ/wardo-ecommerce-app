import User from '../models/userModel.js'
import { UserDb, UserDocument } from '../types/userTypes.js'
import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

export const passwordToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params
    console.log(token)

    const user = await User.findOne({
      resetPasswordToken: token,
    }) as UserDocument

    if (!user) {
      res.status(404)
      throw new Error('Token de reinicio de contraseña inválido')
    }

    const isExpired = user.resetPasswordExpiresAt &&
      new Date(user.resetPasswordExpiresAt).getTime() < Date.now()
    
    if (isExpired) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpiresAt = undefined
      user.save()

      res.status(401)
      throw new Error('Token expirado')
    }

    req.user = user
    next()
  }
)

export default passwordToken
