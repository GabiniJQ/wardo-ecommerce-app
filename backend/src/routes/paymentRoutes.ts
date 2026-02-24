import express from 'express'
import {
  cancelPaymentIntent,
  createPaymentIntent,
  getPaymentIntent,
} from '../controllers/paymentController.js'
import { validateCreatePaymentIntent } from '../middlewares/validateRequest.js'

const paymentRoutes = express.Router()

paymentRoutes.post(
  '/create-payment-intent',
  validateCreatePaymentIntent,
  createPaymentIntent,
)

paymentRoutes.get('/payment-intent/:paymentIntentId', getPaymentIntent)

paymentRoutes.post(
  '/cancel-payment-intent/:paymentIntentId',
  cancelPaymentIntent,
)

export default paymentRoutes
