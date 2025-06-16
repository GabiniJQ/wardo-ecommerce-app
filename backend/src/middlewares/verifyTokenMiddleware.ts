import jwt, { JwtPayload } from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import { Request, Response, NextFunction } from 'express'
import sanitizeUser from '../utils/sanitizeUser.js'

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token
    if (!token) {
      res.status(401)
      throw new Error('Token no autorizado')
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no definido en variables de entorno')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

    if (!decoded) {
      res.status(401)
      throw new Error('Unauthorized - invalid token')
    }

    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      res.status(401)
      throw new Error('Usuario no encontrado o insuficientes permisos')
    }

    const userObj = user.toObject()

    req.user = sanitizeUser(userObj)

    next()
  }
)

export default protect
