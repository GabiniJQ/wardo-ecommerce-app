import { Order } from '../models/orderModel'
import Product from '../models/productModel'
import { IOrder, OrderStatus } from '../types/orderTypes'
import Stripe from 'stripe'

export class OrderService {
  /**
   * Create a new order
   */
  async createOrder(
    paymentIntent: Stripe.PaymentIntent,
    userId?: string,
  ): Promise<IOrder> {
    const metadata = paymentIntent.metadata
    const items = metadata.items ? JSON.parse(metadata.items) : []

    const order = await Order.create({
      user: userId,
      items,
      totalAmount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: OrderStatus.PENDING,
      paymentIntentId: paymentIntent.id,
      stripePaymentStatus: paymentIntent.status,
      customerEmail: metadata.customerEmail || paymentIntent.receipt_email,
      metadata: paymentIntent.metadata,
    })

    return order
  }

  /**
   * Update order status based on payment intent
   */
  async updateOrderStatus(
    paymentIntentId: string,
    status: OrderStatus,
    stripePaymentStatus?: string,
  ): Promise<IOrder | null> {
    const order = await Order.findOneAndUpdate(
      { paymentIntentId },
      {
        status,
        stripePaymentStatus,
      },
      { new: true },
    )

    // Update product stock if payment succeeded
    if (order && status === OrderStatus.PAID) {
      await this.updateProductStock(order)
    }

    return order
  }

  /**
   * Update product stock after successful payment
   */
  private async updateProductStock(order: IOrder): Promise<void> {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      })
    }
  }

  /**
   * Get order by payment intent ID
   */
  async getOrderByPaymentIntent(
    paymentIntentId: string,
  ): Promise<IOrder | null> {
    return await Order.findOne({ paymentIntentId }).populate('items.product')
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId: string): Promise<IOrder[]> {
    return await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product')
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<IOrder | null> {
    return await Order.findById(orderId).populate('items.product')
  }
}

export const orderService = new OrderService()
