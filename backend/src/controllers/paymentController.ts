import { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import { stripeService } from '../services/stripeService.js'
import { orderService } from '../services/orderService.js'
import {
  CreatePaymentIntentRequest,
  PaymentIntentResponse,
} from '../types/paymentTypes.js'

export const createPaymentIntent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data: CreatePaymentIntentRequest = req.body

    if (!data) {
      res.status(400)
      throw new Error('Información de pago no encontrada')
    }

    if (!data.customerEmail || !data.items || !data.shippingAddress) {
      res.status(400)
      throw new Error('Información de pago no válida')
    }

    const paymentIntent = await stripeService.createPaymentIntent(data)

    const order = await orderService.createOrder(paymentIntent, req.user?._id)

    const response: PaymentIntentResponse = {
      clientSecret: paymentIntent.client_secret!,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      orderId: order._id.toString(),
    }

    res.status(200).json(response)
  },
)

export const getPaymentIntent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { paymentIntentId } = req.params

    const paymentIntent =
      await stripeService.retrievePaymentIntent(paymentIntentId)

    res.status(200).json(paymentIntent)
  },
)

export const cancelPaymentIntent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { paymentIntentId } = req.params

    const paymentIntent =
      await stripeService.cancelPaymentIntent(paymentIntentId)

    await orderService.updateOrderStatus(paymentIntentId, 'cancelled' as any)

    res.status(200).json({
      message: 'Payment cancelled successfully',
      paymentIntent,
    })
  },
)
