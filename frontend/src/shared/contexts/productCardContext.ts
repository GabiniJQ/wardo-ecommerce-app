import { createContext, useContext } from 'react'
import { Product } from '@/shared/types/productTypes'

type ProductCardContextType = {
  product?: Product
}

export const ProductCardContext = createContext<ProductCardContextType>({})
export const useProductCard = () => useContext(ProductCardContext)