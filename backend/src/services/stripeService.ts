import Stripe from 'stripe'
import stripe from '../config/stripe'
import { CreatePaymentIntentRequest } from '../types/paymentTypes'
import Product from '../models/productModel'
import { AppError } from '../types/appError'

export class StripeService {
  /**
   * Create a payment intent for checkout
   */
  async createPaymentIntent(
    data: CreatePaymentIntentRequest,
  ): Promise<Stripe.PaymentIntent> {
    const { items, customerEmail, shippingAddress } = data

    // Validate and calculate total
    const { totalAmount, orderItems } = await this.calculateOrderTotal(items)

    if (totalAmount <= 0) {
      throw new AppError('Invalid order amount', 'INVALID_ORDER_AMOUNT')
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd', // Can be dynamic based on user location
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(orderItems),
        customerEmail: customerEmail || '',
      },
      receipt_email: customerEmail,
      shipping: shippingAddress
        ? {
            name: customerEmail || 'Customer',
            address: {
              line1: shippingAddress.line1,
              line2: shippingAddress.line2,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.postalCode,
              country: shippingAddress.country,
            },
          }
        : undefined,
    })

    return paymentIntent
  }

  /**
   * Calculate order total and validate products
   */
  private async calculateOrderTotal(
    items: { id: string; quantity: number }[],
  ): Promise<{ totalAmount: number; orderItems: any[] }> {
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.id)

      if (!product) {
        throw new AppError(`Product ${item.id} not found`, 'PRODUCT_NOT_FOUND')
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for ${product.title}. Available: ${product.stock}`,
          'NO_STOCK',
        )
      }

      const itemTotal = product.price * item.quantity
      totalAmount += itemTotal

      orderItems.push({
        product: product._id,
        name: product.title,
        price: product.price,
        quantity: item.quantity,
      })
    }

    return { totalAmount, orderItems }
  }

  /**
   * Retrieve payment intent details
   */
  async retrievePaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    return await stripe.paymentIntents.retrieve(paymentIntentId)
  }

  /**
   * Cancel payment intent
   */
  async cancelPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    return await stripe.paymentIntents.cancel(paymentIntentId)
  }

  /**
   * Create a refund
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
  ): Promise<Stripe.Refund> {
    const refundData: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    }

    if (amount) {
      refundData.amount = amount
    }

    return await stripe.refunds.create(refundData)
  }

  /**
   * Construct webhook event
   */
  constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
    webhookSecret: string,
  ): Stripe.Event {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  }
}

export const stripeService = new StripeService()
