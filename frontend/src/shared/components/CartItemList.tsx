import { selectCartWithDetails } from '@/features/cart/cartSelectors'
import CartItem from '@/pages/cart/CartItem'
import { CartItemWithDetails } from '@/shared/types/cartTypes'
import clsx from 'clsx'
import { useSelector } from 'react-redux'

const CartItemList = ({ className }: { className?: string}) => {
  const cartItems = useSelector(selectCartWithDetails)

  return (
    <div className={clsx('grid gap-4 md:col-span-2', className)}>
      {cartItems.map((item: CartItemWithDetails) => {
        const key = item._id
        return <CartItem itemId={item._id} key={key} />
      })}
    </div>
  )
}

export default CartItemList
