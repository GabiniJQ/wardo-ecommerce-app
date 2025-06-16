// src/types/express.d.ts
import { UserDb, UserDocument, UserResponse } from '@/types/userTypes.js'

declare global {
  namespace Express {
    interface Request {
      user?: UserResponse | UserDocument
    }
  }
}