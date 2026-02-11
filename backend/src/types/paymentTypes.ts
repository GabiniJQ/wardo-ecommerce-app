export interface CreatePaymentIntentRequest {
  items: {
    id: string
    quantity: number
  }[]
  customerEmail?: string
  shippingAddress?: {
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
}

export interface PaymentIntentResponse {
  clientSecret: string
  amount: number
  currency: string
  orderId: string
}
