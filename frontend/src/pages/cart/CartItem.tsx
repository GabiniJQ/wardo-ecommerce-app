import { AppDispatch, RootState } from '@/app/store'
import Loader from '@/shared/components/Loader'
import Quantity from '@/shared/components/Quantity'
import  {
  ToastNotification,
  ToastNotificationMessage,
} from '@/shared/components/ToastNotification'
import { removeItemCart, removeItemCartLocal, updateItemQuantity } from '@/features/cart/cartSlice'
import { selectProductById } from '@/features/products/productSelectors'
import { fetchProductById } from '@/features/products/productsSlice'
import { formatCategoryURL } from '@/shared/utils/utils'
import {
  ProductCard,
  ProductCardButton,
  ProductCardImage,
  ProductCardInfo,
} from '@/pages/home/ProductCard'
import { type CartItem } from '@/shared/types/cartTypes'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { TrashIcon } from 'lucide-react'

const CartItem = ({ itemId }: { itemId: string }) => {
  const { user } = useSelector((state: RootState) => state.auth)
  const { product } = useSelector(selectProductById(itemId))
  const { isError, isLoading } = useSelector((state: RootState) => state.cart.removeItems)
  const dispatch = useDispatch<AppDispatch>()

  const localItems: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')
  const [hasQuantityError, setHasQuantityError] = useState(false)

  // Current item being deleted by RemoveItemCart
  const [currentDelete, setCurrentDelete] = useState('')

  useEffect(() => {
    if (!product) {
      dispatch(fetchProductById(itemId))
    }
  }, [product, dispatch, itemId])

  useEffect(() => {

    if (!user && product && localItems.length > 0) {
      const currentItem = localItems.find((localItem) => localItem.productId === itemId )

      if (currentItem && currentItem.quantity > product.stock) {
        dispatch(updateItemQuantity({ productId: itemId, quantity: 1 }))
        setHasQuantityError(true)
        return
      }
    }

    setHasQuantityError(false)
  }, [user, product, localItems, setHasQuantityError, dispatch, itemId])

  const items = useSelector((state: RootState) => state.cart.items)

  const deleteProduct = async (itemId: string) => {
    try {
      setCurrentDelete(itemId)
      if (!user) {
        dispatch(removeItemCartLocal(itemId))
        toast(
          <ToastNotification className='text-mustard-primary'>
            <ToastNotificationMessage type='alert'>
              Producto eliminado del carrito
            </ToastNotificationMessage>
          </ToastNotification>
        )
        
      } else if (user) {
        const resultAction = await dispatch(removeItemCart({
          userId: user._id, productId: itemId
        }))
        const removeSuccess = removeItemCart.fulfilled.match(resultAction)

        toast(
          <ToastNotification className={`${removeSuccess ? 'text-mustard-primary' : 'text-red-500'}`}>
            <ToastNotificationMessage type={`${removeSuccess ? 'alert' : 'error'}`}>
              {removeSuccess
                ? 'Producto eliminado del carrito'
                : 'Error al eliminar producto'
              }
            </ToastNotificationMessage>
          </ToastNotification>
        )
      }
    } catch {
      toast(
        <ToastNotification className='text-red-500'>
          <ToastNotificationMessage type='error'>
            Error al eliminar producto
          </ToastNotificationMessage>
        </ToastNotification>
      )
    }
    finally {
      setCurrentDelete('')
    }
  }
  if (!product) return

  const { category, _id, slug, stock } = product
  const productPath = `${formatCategoryURL(category)}/${slug}/${_id}`

  const cartItem = items.find((item) => item.productId === itemId)
  
  if (!cartItem) return

  return (
    <ProductCard
      product={product}
      className='flex-row shadow p-4 text-sm max-h-52'
    >
      <Link to={`/${productPath}`} className='flex flex-col items-center justify-center sm:w-1/2'>
        <ProductCardImage className='shrink-0 max-w-52 md:group-hover:-translate-0' />
      </Link>
      
      <div className='flex flex-col justify-between gap-2 w-full sm:mt-4 sm:w-1/2 sm:gap-1'>
        <Link to={`/${productPath}`} className='flex flex-col justify-center'>
          <ProductCardInfo className='gap-0'/>
        </Link>

        <div className='flex justify-between md:justify-start lg:gap-2'>
          <Quantity
            quantity={cartItem?.quantity}
            onChange={(val) => dispatch(updateItemQuantity({ productId: cartItem?.productId, quantity: val}))}
            stock={stock}
          />

          {hasQuantityError && (
            <p className='text-red-500 text-xs italic'>Cantidad seleccionada excede el stock disponible</p>
          )}

          <div className='flex justify-center items-center'>
            <ProductCardButton
              className='bg-red-400 sm:bg-primary hover:bg-red-400 w-full sm:max-w-60'
              onClick={() => deleteProduct(itemId) }
              disabled={isLoading}
            >
              {currentDelete === itemId && isLoading || isError 
                ? <Loader className='size-6'/>
                : <TrashIcon />
              }
            </ProductCardButton>
          </div>
        </div>
      </div>
    </ProductCard>
  )
}

export default CartItem
