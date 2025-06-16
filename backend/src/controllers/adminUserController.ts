import { Request, Response } from "express"
import asyncHandler from "express-async-handler"

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Getting users' })
})