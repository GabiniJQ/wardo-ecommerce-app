import { Request, Response, NextFunction } from 'express'
import { stripeService } from '../services/stripeService.js'
import { orderService } from '../services/orderService.js'
import {
  CreatePaymentIntentRequest,
  PaymentIntentResponse,
} from '../types/paymentTypes.js'

export class PaymentController {
  /**
   * Create payment intent
   */
  async createPaymentIntent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data: CreatePaymentIntentRequest = req.body

      // Create payment intent with Stripe
      const paymentIntent = await stripeService.createPaymentIntent(data)

      // Create order in database
      const order = await orderService.createOrder(paymentIntent, req.user?._id)

      const response: PaymentIntentResponse = {
        clientSecret: paymentIntent.client_secret!,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        orderId: order._id.toString(),
      }

      res.status(200).json(response)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  /**
   * Get payment intent details
   */
  async getPaymentIntent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { paymentIntentId } = req.params

      const paymentIntent =
        await stripeService.retrievePaymentIntent(paymentIntentId)

      res.status(200).json(paymentIntent)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Cancel payment intent
   */
  async cancelPaymentIntent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { paymentIntentId } = req.params

      const paymentIntent =
        await stripeService.cancelPaymentIntent(paymentIntentId)

      await orderService.updateOrderStatus(paymentIntentId, 'cancelled' as any)

      res.status(200).json({
        message: 'Payment cancelled successfully',
        paymentIntent,
      })
    } catch (error) {
      next(error)
    }
  }
}

export const paymentController = new PaymentController()
