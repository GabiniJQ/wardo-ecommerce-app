import { RootState } from '@/app/store'
import { createSelector } from '@reduxjs/toolkit'

// Base selector for getting cart items
export const selectCartItems = (state: RootState) => state.cart.items

// Base selector for getting all products
export const selectProductsById  = (state: RootState) => state.products.byId

// Combined selector for joining cart item with product details
export const selectCartWithDetails = createSelector([selectCartItems, selectProductsById],
  (cartItems, productsById) => {
    return cartItems.map((item) => {
      const productData = productsById[item.productId]
      if (!productData || !productData.product) return null

      const product = productData.product

      return ({
        ...product,
        quantity: item.quantity,
        subtotal: item.quantity * product.discountedPrice
      })
    }).filter((item): item is NonNullable<typeof item> => item !== null) // Type assertion for filtering nulls
  }
)

// Selector for calculating checkout total
export const selectCartTotal = createSelector([selectCartWithDetails],
  (cartWithDetails) => {
    return cartWithDetails.reduce((total, item) => total + item.subtotal, 0)
  }
)

// Selector for counting total quantity
export const selectCartItemsCount = createSelector([selectCartWithDetails],
  (cartWithDetails) => {
    return cartWithDetails.reduce((count, item) => count + item.quantity, 0)
  }
)
