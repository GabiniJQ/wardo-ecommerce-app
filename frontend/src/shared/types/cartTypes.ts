import { Product } from '@/shared/types/productTypes'

export type CartItem = {
  _id?: string
  productId: string
  quantity: number
}

export interface CartItemWithDetails extends Product {
  quantity: number
  subtotal: number
}

export type CartState = {
  items: CartItem[]
  tempMergeItems: CartItem[] | null
  mergeDialogOpen: boolean
  addItemById: {
    isSuccess: boolean
    isLoading: boolean
    isError: boolean
  }
  removeItems: {
    isSuccess: boolean,
    isLoading: boolean,
    isError: boolean,
  }
}

export type CartItemResponse = {
  message: string
  item: CartItem
}