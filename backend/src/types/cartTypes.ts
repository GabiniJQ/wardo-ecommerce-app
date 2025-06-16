import { Types  } from 'mongoose'

export type CartItemDb = {
  _id: Types.ObjectId
  productId: string
  quantity: number
}

export type CartDb = {
  items: CartItemDb[]
}
