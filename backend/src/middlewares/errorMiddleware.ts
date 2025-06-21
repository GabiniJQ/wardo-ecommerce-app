import { Request, Response, NextFunction } from 'express'

export interface ErrorResponse {
  message: string
  stack: string
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status ?? res.statusCode ? res.statusCode : 500
  console.log('statusCode :', statusCode)
  
  res.status(statusCode)
  console.log('Capturado en middleware: ', err.message)
  res.json({
    message: err.message || 'Error del servidor',
    errorCode: err.errorCode || null,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
  
}