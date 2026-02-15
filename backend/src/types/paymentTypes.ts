import { CartItemDb } from './cartTypes'
import { Address } from './userTypes'

export interface CreatePaymentIntentRequest {
  items: CartItemDb[]
  customerEmail?: string
  shippingAddress: Address
}

export interface PaymentIntentResponse {
  clientSecret: string
  amount: number
  currency: string
  orderId: string
}
