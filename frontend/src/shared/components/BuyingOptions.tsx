import { AppDispatch, RootState } from '@/app/store'
import  {
  ToastNotification,
  ToastNotificationButton,
  ToastNotificationMessage,
} from '@/shared/components/ToastNotification'
import { Button } from '@/shared/components/ui/button'
import { addItemById, setCart } from '@/features/cart/cartSlice'
import { CartItem } from '@/shared/types/cartTypes'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

type BuyingOptionsProps = {
  productId: string
  quantity: number
  stock: number
}

const BuyingOptions = ({ productId, quantity, stock }: BuyingOptionsProps) => {
  const user = useSelector((state: RootState) => state.auth.user)

  const dispatch = useDispatch<AppDispatch>()

  const addToCart = async (product: { productId: string, quantity: number }) => {
    try {
      if (!user) {
        const currentCart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')
        const existing = currentCart.find((item) => item.productId === productId)
        
        if (existing) {
          const sum = existing.quantity + quantity

          if (sum <= stock) {
            existing.quantity += quantity
            toast(
              <ToastNotification className='text-primary'>
                <ToastNotificationMessage type='success'>
                  Producto añadido al carrito
                </ToastNotificationMessage>

                <ToastNotificationButton to='/cart'>
                  Ir al carrito
                </ToastNotificationButton>
              </ToastNotification>
            )
          } else {
            toast(
              <ToastNotification className='text-red-500'>
                <ToastNotificationMessage type='error'>
                  Cantidad no disponible en stock
                </ToastNotificationMessage>
              </ToastNotification>
            )
          }
        } else {
          currentCart.push(product)
          toast(
            <ToastNotification className='text-primary'>
              <ToastNotificationMessage type='success'>
                Producto añadido al carrito
              </ToastNotificationMessage>

              <ToastNotificationButton to='/cart'>
                Ir al carrito
              </ToastNotificationButton>
            </ToastNotification>
          )
        }

        localStorage.setItem('cart', JSON.stringify(currentCart))
        dispatch(setCart(currentCart))
      } else if (user._id) {
        const { productId } = product
        const newItem = {
          productId,
          quantity,
        }

        const resultAction = await dispatch(addItemById({ userId: user._id, itemData: newItem }))

        if (addItemById.fulfilled.match(resultAction)) {
          toast(
            <ToastNotification className='text-primary'>
              <ToastNotificationMessage type='success'>
                Producto añadido al carrito
              </ToastNotificationMessage>

              <ToastNotificationButton to='/cart'>
                Ir al carrito
              </ToastNotificationButton>
            </ToastNotification>
          )
        } else {
          <ToastNotification className='text-red-500'>
            <ToastNotificationMessage type='error'>
              Error al eliminar producto
            </ToastNotificationMessage>
          </ToastNotification>
        }
      }
    } catch {
      <ToastNotification className='text-red-500'>
        <ToastNotificationMessage type='error'>
          Error al eliminar producto
        </ToastNotificationMessage>
      </ToastNotification>
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <Button className='w-full btn'>Comprar ahora</Button>

      <Button
        className='w-full btn'
        variant='secondary'
        onClick={() => {
          addToCart({ productId, quantity: 1 })
        }}
      >
        Agregar al carrito
      </Button>
    </div>
  )
}

export default BuyingOptions
