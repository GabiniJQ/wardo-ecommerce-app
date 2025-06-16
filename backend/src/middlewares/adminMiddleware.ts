import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

export const admin = asyncHandler( async(req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403)
    throw new Error('Insufficient permissions')
  }
})

export default admin