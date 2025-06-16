import express from 'express'
import admin from '../middlewares/adminMiddleware.js'
import { getUsers } from '../controllers/adminUserController.js'

const adminRouter = express.Router()

adminRouter.get('/', admin, getUsers)

export default adminRouter

