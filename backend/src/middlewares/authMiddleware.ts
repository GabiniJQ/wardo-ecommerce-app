import jwt, { JwtPayload } from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '@/models/userModel'
import { Request, Response, NextFunction } from 'express'
import sanitizeUser from '@/utils/sanitizeUser'

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(' ')[1]

        // Verify token
        if (!process.env.JWT_SECRET) {
          throw new Error(
            'JWT_SECRET no está definido'
          )
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
        const user = await User.findById(decoded.id).select('-password')

        if (!user) {
          res.status(401)
          throw new Error('Usuario no encontrado')
        }

        req.user = sanitizeUser(user)
        next()
      } catch (error) {
        res.status(401)
        throw new Error('Usuario no autorizado')
      }
    }

    if (!token) {
      throw new Error('Token de autorización no encontrado')
    }
  }
)

export default protect
