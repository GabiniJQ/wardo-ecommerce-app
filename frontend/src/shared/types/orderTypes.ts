export type OrderResponse = {
  message: string
  order: Order
}

export type Order = {
  _id: string
  items: OrderItem[]
  totalAmount: number
  customerEmail: string | undefined
  createdAt: string
}

export type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
  _id: string
}
