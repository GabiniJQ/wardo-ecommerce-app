export type CartItem = {
  _id?: string
  productId: string
  quantity: number
}

export type CartState = {
  items: CartItem[]
  tempMergeItems: CartItem[] | null
  mergeDialogOpen: boolean
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