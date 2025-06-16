import { RootState } from '@/app/store'
import { createSelector } from '@reduxjs/toolkit'

export const selectProductByCategory = createSelector(
  [
    (state: RootState) => state.products.byCategory,
    (_: RootState, category: string) => category
  ],
  (byCategory, category) => ({
    products: byCategory[category]?.products || [],
    isLoading: byCategory[category]?.isLoading || false,
    isError: byCategory[category]?.isError || false,
    hasBeenAttempted: byCategory[category]?.hasBeenAttempted || false
  })
)

export const selectProductById = (id: string) => createSelector(
  (state: RootState) => state.products.byId,
  (byId) => byId[id] || { isLoading: false, product: null, isError: false }
)