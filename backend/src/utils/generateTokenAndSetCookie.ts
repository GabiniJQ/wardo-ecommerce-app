import { Response } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export const generateTokenAndSetCookie = (
  res: Response,
  userId: mongoose.Types.ObjectId,
) => {
  const isProduction = process.env.NODE_ENV === 'production'

  if (process.env.JWT_SECRET) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    })
    console.log('token set', token)
    const setCookieHeader = res.getHeader('Set-Cookie')
    console.log('🍪 Set-Cookie header:', setCookieHeader)

    return token
  } else {
    throw new Error('No JWT Secret found')
  }
}
