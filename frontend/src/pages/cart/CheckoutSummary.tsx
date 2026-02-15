import { DELIVERY_FEE } from '@/consts/deliveryFee'
import { ROUTES } from '@/consts/routes'
import { selectCartItemsCount, selectCartTotal } from '@/features/cart/cartSelectors'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { formattedPrice } from '@/shared/utils/utils'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

const CheckoutSummary = ({ isCheckout }: { isCheckout: boolean }) => {
  const total = useSelector(selectCartTotal)
  const count = useSelector(selectCartItemsCount)

  return (
    <div className='flex flex-col max-h-fit mt-10 md:shadow md:p-6 md:gap-6 md:bg-primary-foreground md:mt-0 '>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-lg'>
            Subtotal de la compra ({count} producto
            {count > 1 ? 's' : ''}):
          </h2>

          <Separator orientation='horizontal' />
        </div>

        

        <div className='flex justify-between'>
          <span className='text-gray-500'>Subtotal:</span>
          <span>{formattedPrice(total)}</span>
        </div>

        <div className='flex justify-between'>
          <span className='text-gray-500'>Envío:</span>
          <span>{formattedPrice(DELIVERY_FEE)}</span>
        </div>


        <div className='flex justify-between'>
          <span className='text-lg font-semibold'>TOTAL:</span>
          <span className='font-semibold text-lg'>
            {formattedPrice(total + DELIVERY_FEE)}
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-2 mt-6 md:mt-0'>
        

        {!isCheckout && (
          <>
            <Separator orientation='horizontal' />
          
            <Link to={ROUTES.CHECKOUT}>
              <Button className='w-full my-2 py-6 md:my-0'>
                Proceder al pago
              </Button>
            </Link>
          </>
          
        )}
      </div>
    </div>
  )
}

export default CheckoutSummary
