import { Request, Response, NextFunction } from 'express'

const authorizeRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(401)
      throw new Error('Access denied: insufficient role')
    }

    next()
  }
}
