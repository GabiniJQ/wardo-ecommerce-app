import { Document, Types } from 'mongoose'

export interface IOrderItem {
  product: string
  name: string
  price: number
  quantity: number
}

export interface IOrder extends Document {
  _id: Types.ObjectId
  user?: string
  items: IOrderItem[]
  totalAmount: number
  currency: string
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
  paymentIntentId: string
  stripePaymentStatus?: string
  customerEmail?: string
  shippingAddress?: {
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}
