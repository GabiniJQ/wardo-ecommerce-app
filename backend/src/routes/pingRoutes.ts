import express from 'express'
import { pingServer } from '../controllers/pingController.js'

const pingRouter = express.Router()

pingRouter.get('/', pingServer)

export default pingRouter
