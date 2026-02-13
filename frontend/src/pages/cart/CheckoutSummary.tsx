import { DELIVERY_FEE } from '@/consts/deliveryFee'
import { selectCartItemsCount, selectCartTotal } from '@/features/cart/cartSelectors'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { formattedPrice } from '@/shared/utils/utils'
import { useSelector } from 'react-redux'

const CheckoutSummary = () => {
  const total = useSelector(selectCartTotal)
  const count = useSelector(selectCartItemsCount)

  return (
    <div className='flex flex-col md:shadow md:p-6 md:gap-6 md:bg-primary-foreground max-h-fit'>
      <Button className='w-full bg-mustard-primary my-10 py-6 md:my-0'>
        Proceder al pago
      </Button>

      <div className='flex flex-col gap-6'>
        <h2 className='text-lg'>
          Subtotal de la compra ({count} producto
          {count > 1 ? 's' : ''}):
        </h2>

        <div className='flex justify-between'>
          <span className='text-gray-500'>Subtotal:</span>
          <span>{formattedPrice(total)}</span>
        </div>

        <div className='flex justify-between'>
          <span className='text-gray-500'>Envío:</span>
          <span>{formattedPrice(DELIVERY_FEE)}</span>
        </div>

        <Separator orientation='horizontal' />

        <div className='flex justify-between'>
          <span className='text-gray-500 text-lg'>TOTAL:</span>
          <span className='font-semibold text-lg'>
            {formattedPrice(total + DELIVERY_FEE)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
