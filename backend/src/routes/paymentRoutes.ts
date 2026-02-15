import express from 'express'
import { paymentController } from '../controllers/paymentController'
import { validateCreatePaymentIntent } from '../middlewares/validateRequest'

const paymentRoutes = express.Router()

paymentRoutes.post(
  '/create-payment-intent',
  validateCreatePaymentIntent,
  paymentController.createPaymentIntent.bind(paymentController),
)

paymentRoutes.get(
  '/payment-intent/:paymentIntentId',
  paymentController.getPaymentIntent.bind(paymentController),
)

paymentRoutes.post(
  '/cancel-payment-intent/:paymentIntentId',
  paymentController.cancelPaymentIntent.bind(paymentController),
)

export default paymentRoutes
