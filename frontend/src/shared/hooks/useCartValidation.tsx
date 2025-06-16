import { CartItem } from '@/shared/types/cartTypes'
import { useEffect } from 'react'

const useCartValidation = () => {
  const localItems: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')

  useEffect(() => {
    console.log('listening for localItems')
  }, [localItems])
  return 
}

export default useCartValidation
