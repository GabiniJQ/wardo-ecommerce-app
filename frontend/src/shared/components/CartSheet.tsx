import { Button } from '@/shared/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet'
import { HiShoppingCart } from 'react-icons/hi'

type Props = {
  cartShown: boolean
  setCartShown: (cartShown: boolean) => void
}

const CartSheet = ({ cartShown, setCartShown }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='border'
          className='cursor-pointer px-1'
          size='default'
          onClick={() => setCartShown(!cartShown)}
        >
          <HiShoppingCart className='size-5' />
        </Button>
      </SheetTrigger>
      <SheetContent className='bg-white'>
        <SheetHeader>
          <SheetTitle>Tu carrito 🛒</SheetTitle>
          <SheetDescription>No tienes ningún producto en el carrito.</SheetDescription>
        </SheetHeader>
        <div className='flex gap-4 p-4'>
          <p>iteems</p>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type='submit'>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default CartSheet
