import Stripe from 'stripe'
import stripe from '../config/stripe'
import { CreatePaymentIntentRequest } from '../types/paymentTypes'
import Product from '../models/productModel'
import { AppError } from '../types/appError'
import { CartItemDb } from '../types/cartTypes'
import { IOrderItem } from '../types/orderTypes'
import { toSmallestUnit } from '../utils/currency'

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
              line1: shippingAddress.addressInfo.number1,
              line2: shippingAddress.addressInfo.number2,
              city: shippingAddress.city,
              state: shippingAddress.department,
              postal_code: shippingAddress.addressInfo.postalCode,
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
    items: CartItemDb[],
  ): Promise<{ totalAmount: number; orderItems: IOrderItem[] }> {
    let totalAmount = 0
    const orderItems = []
    const currency = 'USD' // Default Currency

    for (const item of items) {
      const product = await Product.findById(item.productId)

      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 'PRODUCT_NOT_FOUND')
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
        productId: product._id.toString(),
        name: product.title,
        price: product.price,
        quantity: item.quantity,
      })
    }

    // Convert total amount to integer (Amount property requires smallest unit)
    totalAmount = toSmallestUnit(totalAmount, currency)

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
