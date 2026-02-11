import express from 'express'
import { paymentController } from '../controllers/paymentController'
import { validateCreatePaymentIntent } from '../middlewares/validateRequest'

const router = express.Router()

router.post(
  '/create-payment-intent',
  validateCreatePaymentIntent,
  paymentController.createPaymentIntent.bind(paymentController),
)

router.get(
  '/payment-intent/:paymentIntentId',
  paymentController.getPaymentIntent.bind(paymentController),
)

router.post(
  '/cancel-payment-intent/:paymentIntentId',
  paymentController.cancelPaymentIntent.bind(paymentController),
)

export default router
