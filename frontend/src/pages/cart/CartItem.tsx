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

const CartItem = ({ id }: { id: string }) => {
  const { user } = useSelector((state: RootState) => state.auth)
  const { product } = useSelector(selectProductById(id))
  const { isError, isLoading } = useSelector((state: RootState) => state.cart.removeItems)
  const dispatch = useDispatch<AppDispatch>()

  const localItems: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')
  const [hasQuantityError, setHasQuantityError] = useState(false)

  useEffect(() => {
    if (!product) {
      dispatch(fetchProductById(id))
    }
  }, [product, dispatch, id])

  useEffect(() => {

    if (!user && product && localItems.length > 0) {
      const currentItem = localItems.find((localItem) => localItem.productId === id )

      if (currentItem && currentItem.quantity > product.stock) {
        dispatch(updateItemQuantity({ productId: id, quantity: 1 }))
        setHasQuantityError(true)
        return
      }
    }

    setHasQuantityError(false)
  }, [user, product, localItems, setHasQuantityError, dispatch, id])

  const items = useSelector((state: RootState) => state.cart.items)

  const deleteProduct = async (id: string) => {
    try {
      if (!user) {
        dispatch(removeItemCartLocal(id))
        toast(
          <ToastNotification className='text-mustard-primary'>
            <ToastNotificationMessage type='alert'>
              Producto eliminado del carrito
            </ToastNotificationMessage>
          </ToastNotification>
        )
        
      } else if (user) {
        const resultAction = await dispatch(removeItemCart({
          userId: user._id, productId: id
        }))
        toast(
          <ToastNotification className='text-red-500'>
            <ToastNotificationMessage type='error'>
              {removeItemCart.fulfilled.match(resultAction)
                ? 'Producto eliminado del carrito'
                : 'Error al eliminar producto'
              }
            </ToastNotificationMessage>
          </ToastNotification>
        )
      }
    } catch (error) {
      toast(
        <ToastNotification className='text-red-500'>
          <ToastNotificationMessage type='error'>
            Error al eliminar producto
          </ToastNotificationMessage>
        </ToastNotification>
      )
    }
  }
  if (!product) return

  const { category, _id, slug, stock } = product
  const productPath = `${formatCategoryURL(category)}/${slug}/${_id}`

  const cartItem = items.find((item) => item.productId === id)
  
  if (!cartItem) return

  return (
    <ProductCard
      product={product}
      className='flex-row p-4 justify-center gap-0 max-w-[500px] shadow'
    >
      <Link to={`/${productPath}`} className='flex flex-col items-center justify-center w-1/2'>
        <ProductCardImage className='shrink-0 md:group-hover:-translate-0' />
      </Link>
      
      <div className='flex flex-col justify-between w-1/2 px-4 sm:mt-4'>
        <Link to={`/${productPath}`} className='flex flex-col justify-center'>
          <ProductCardInfo className='gap-0'/>
        </Link>

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
            className=' hover:bg-red-400 w-full  max-w-60'
            onClick={() => deleteProduct(id) }
            disabled={isLoading}
          >
            {isLoading || isError
              ? <Loader className='size-6'/>
              : 'Eliminar del carrito'
            }
          </ProductCardButton>
        </div>
      </div>
    </ProductCard>
  )
}

export default CartItem
