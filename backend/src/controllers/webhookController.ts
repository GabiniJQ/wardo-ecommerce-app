import { Request, Response, NextFunction } from 'express'
import { stripeService } from '../services/stripeService.js'
import { orderService } from '../services/orderService.js'
import { OrderStatus } from '../types/orderTypes.js'
import Stripe from 'stripe'
import chalk from 'chalk'

export class WebhookController {
  /**
   * Handle Stripe webhooks
   */
  async handleStripeWebhook(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const sig = req.headers['stripe-signature'] as string

    try {
      const event = stripeService.constructWebhookEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      )

      console.log(chalk.blue(`Webhook received: ${event.type}`))

      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(
            event.data.object as Stripe.PaymentIntent,
          )
          break

        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(
            event.data.object as Stripe.PaymentIntent,
          )
          break

        case 'payment_intent.canceled':
          await this.handlePaymentCanceled(
            event.data.object as Stripe.PaymentIntent,
          )
          break

        case 'charge.refunded':
          await this.handleRefund(event.data.object as Stripe.Charge)
          break

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      res.json({ received: true })
    } catch (error) {
      console.error('Webhook error:', error)
      next(error)
    }
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSuccess(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    console.log('Payment succeeded:', paymentIntent.id)

    const order = await orderService.updateOrderStatus(
      paymentIntent.id,
      OrderStatus.PAID,
      paymentIntent.status,
    )

    if (order && order.customerEmail) {
      console.log(chalk.red('Order success: ', order.id))
    }
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentFailed(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    console.log('Payment failed:', paymentIntent.id)

    const order = await orderService.updateOrderStatus(
      paymentIntent.id,
      OrderStatus.FAILED,
      paymentIntent.status,
    )

    if (order && order.customerEmail) {
      console.log('Payment failed:', order.id)
    }
  }

  /**
   * Handle canceled payment
   */
  private async handlePaymentCanceled(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    console.log('Payment canceled:', paymentIntent.id)

    await orderService.updateOrderStatus(
      paymentIntent.id,
      OrderStatus.CANCELLED,
      paymentIntent.status,
    )
  }

  /**
   * Handle refund
   */
  private async handleRefund(charge: Stripe.Charge): Promise<void> {
    console.log('Refund processed:', charge.payment_intent)

    if (typeof charge.payment_intent === 'string') {
      await orderService.updateOrderStatus(
        charge.payment_intent,
        OrderStatus.REFUNDED,
      )
    }
  }
}

export const webhookController = new WebhookController()
