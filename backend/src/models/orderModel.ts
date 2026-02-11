import mongoose, { Schema } from 'mongoose'
import { IOrder, OrderStatus } from '../types/orderTypes'

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: String,
      ref: 'User',
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'usd',
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    stripePaymentStatus: String,
    customerEmail: String,
    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
)

orderSchema.index({ paymentIntentId: 1 })
orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ status: 1 })

export const Order = mongoose.model<IOrder>('Order', orderSchema)
