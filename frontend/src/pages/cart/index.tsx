import { AppDispatch, RootState, store } from '@/app/store'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import {
  addItemById,
  confirmMerge,
  fetchUserCart,
  getCartStorage,
  rejectMerge,
  updateItemById,
} from '@/features/cart/cartSlice'
import { formatCategoryURL } from '@/shared/utils/utils'
import CartItem from '@/pages/cart/CartItem'
import {
  ProductCard,
  ProductCardImage,
  ProductCardInfo,
} from '@/pages/home/ProductCard'
import { type CartItem as CartItemType } from '@/shared/types/cartTypes'

import { useEffect } from 'react'
import { HiShoppingCart, HiX } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import BackButton from '@/shared/components/BackButton'

const CartPage = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const { isLoading } = useSelector((state: RootState) => state.auth.checkAuth)
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const products = useSelector((state: RootState) => state.products.byId)
  const { mergeDialogOpen, tempMergeItems } = useSelector(
    (state: RootState) => state.cart
  )

  // Load LocalStorage Cart to state if no user is logged
  const dispatch = useDispatch<AppDispatch>()

  const navigate = useNavigate()

  useEffect(() => {
  // No user detected
    if (!user) { 
      dispatch(getCartStorage())
    } else if(user._id) {
      dispatch(fetchUserCart(user._id))
    }
  }, [user, dispatch, isLoading])

  const displayGuestItems = tempMergeItems?.map((tempItem) => {
    const product = products[tempItem.productId].product
    if (product) {
      const { category, _id, slug } = product
      const productPath = `${formatCategoryURL(category)}/${slug}/${_id}`

      return (
        <ProductCard
          product={product}
          className='flex-row p-4 justify-center gap-0 max-w-[500px] shadow'
          key={tempItem.productId}
        >
          <Link
            to={`/${productPath}`}
            className='flex flex-col items-center justify-center w-1/2'
          >
            <ProductCardImage className='shrink-0' />
          </Link>

          <div className='flex flex-col gap-2 w-1/2 p-4 sm:justify-center'>
            <Link
              to={`/${productPath}`}
              className='flex flex-col justify-center'
            >
              <ProductCardInfo className='gap-0' />
            </Link>

            <p>
              Cantidad: <strong>{tempItem.quantity}</strong>
            </p>
          </div>
        </ProductCard>
      )
    }
  })

  const handleClose = () => {
    dispatch(rejectMerge())
  }

  const handleMerge = () => {
    const itemsBeforeMergeId = store.getState().cart.items.filter((item) => item._id)

    dispatch(confirmMerge())
    
    // POST guestItems(no ID) to user cart in DB
    store.getState().cart.items
      .filter((item) => !item._id)
      .forEach((item) => {
        if (user) {
          dispatch(addItemById({ userId: user?._id, itemData: item}))
        }
      })

    const itemsAfterMergeId = store.getState().cart.items.filter((item) => item._id)

    // Update itemsWithId at user cart in DB 
    itemsBeforeMergeId.forEach((itemBefore) => {
      const itemChanged = itemsAfterMergeId.find((itemAfter) => {
        if (itemBefore._id === itemAfter._id) {
          return itemAfter.quantity - itemBefore.quantity > 0
        }
      })
      if (user && itemChanged) {
        dispatch(updateItemById({ userId: user._id, itemData: itemChanged }))
      }
    })
  }

  return (
    <div className='flex flex-col flex-1 p-4 pb-20 bg-white xl:mx-40 xl:px-20'>
      {/* <BackButton /> */}

      <div className='relative flex justify-center items-center gap-2 sm:justify-start'>
        <BackButton className='absolute left-0 sm:relative'/>

        <h1 className='title text-primary my-6'>Tu carrito</h1>

        <HiShoppingCart className='size-7 text-primary' />
      </div>
      {/* Empty cart*/}
      {cartItems.length === 0 && (
        <div className='text-center'>
          <p className='mt-6 text-xl text-gray-600'>
            Tu carrito está vacío. ¡Descubre nuestras ofertas y encuentra{' '}
            productos con calidad!
          </p>
          <Button
            variant='default'
            className='mt-4'
            onClick={() => navigate('/')}
          >
            Explorar productos
          </Button>
        </div>
      )}

      {/* Products */}
      {cartItems.length > 0 && (
        <div className='flex flex-col gap-6 items-center md:grid md:grid-cols-2 2xl:grid-cols-3'>
          {cartItems.map((item: CartItemType) => {
            const key = `${item.productId}-${item._id ?? ''}`
            return <CartItem itemId={item.productId} key={key} />
          })}
        </div>
      )}

      {/* Recovered from Guest session */}
      {mergeDialogOpen && (
        <Dialog open={mergeDialogOpen}>
          <DialogContent
            className='bg-white p-6 rounded-lg max-w-md'
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            hideCloseButton
          >
            <DialogClose asChild>
              <Button
                onClick={handleClose}
                className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'
                variant='ghost'
              >
                <HiX className='h-4 w-4' />
                <span className='sr-only'>Cerrar</span>
              </Button>
            </DialogClose>
            <DialogHeader>
              <DialogTitle className='text-lg font-bold mb-4'>
                Carrito recuperado
              </DialogTitle>
              <DialogDescription className='bg-white rounded-lg max-w-md'>
                Encontramos {tempMergeItems?.length ?? 0} producto
                {(tempMergeItems?.length ?? 0) > 1 ? 's' : ''} en el carrito de
                invitados. ¿Deseas combinarlo
                {(tempMergeItems?.length ?? 0) > 1 ? 's' : ''} con tu carrito
                actual?
              </DialogDescription>
            </DialogHeader>

            <div className='max-h-60 overflow-y-auto border-t border-b'>
              {displayGuestItems}
            </div>

            <DialogFooter className='flex items-center sm:justify-center py-1'>
              <Button onClick={() => dispatch(rejectMerge())} variant='ghost'>
                Descartar productos
              </Button>
              <Button onClick={() => handleMerge()}>
                Combinar carritos
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default CartPage
