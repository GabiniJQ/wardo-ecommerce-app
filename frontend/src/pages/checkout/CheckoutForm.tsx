import { DELIVERY_FEE } from '@/consts/deliveryFee'
import { selectCartTotal } from '@/features/cart/cartSelectors'
import { Button } from '@/shared/components/ui/button'
import { formattedPrice } from '@/shared/utils/utils'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const CheckoutForm = ({
  setPaymentIntentCreated,
}: {
  setPaymentIntentCreated: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [message, setMessage] = useState<string | undefined>('')
  const [isLoading, setIsLoading] = useState(false)

  const stripe = useStripe()
  const elements = useElements()

  const cartItemsTotal = useSelector(selectCartTotal)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }
    setPaymentIntentCreated(false)
    setIsLoading(true)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    })

    if (error) {
      setMessage(error.message)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <PaymentElement />
      {message && <div className='text-red-600 my-6'>{message}</div>}
      <Button
        disabled={isLoading || !stripe || !elements}
        className='w-full py-6 rounded-md font-bold'
        type='submit'
      >
        {isLoading
          ? 'PROCESANDO...'
          : `PAGAR ${formattedPrice(cartItemsTotal + DELIVERY_FEE)}`}
      </Button>
    </form>
  )
}

export default CheckoutForm
