import { RootState } from '@/app/store'
import { selectMainAddress } from '@/features/checkout/checkoutSelectors'
import CheckoutSummary from '@/pages/cart/CheckoutSummary'
import CartItemList from '@/shared/components/CartItemList'
import formatAdressLine from '@/shared/utils/formatAddressLine'
import { Elements } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Appearance, loadStripe } from '@stripe/stripe-js'
import { selectCartItems } from '@/features/cart/cartSelectors'
import { AxiosResponse } from 'axios'
import { PaymentIntentResponse } from '@/shared/types/paymentTypes'
import api from '@/lib/axios'
import CheckoutForm from '@/pages/checkout/CheckoutForm'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntentCreated, setPaymentIntentCreated] = useState(false)

  const cartItems = useSelector(selectCartItems)
  const mainAddress = useSelector(selectMainAddress)
  const customerEmail = useSelector((state: RootState) => state.auth.user?.email)

  // StripeElement config
  const appearance: Appearance = {
    theme: 'flat',
    variables: {
      colorPrimary: '#2b7fff',
      colorBackground: '#f4f4f5',
      colorText: '#000000',
      borderRadius: '4px',
      fontFamily: 'Sans-serif',
    },
  }
  const loader = 'auto'

  useEffect(() => {
    // Prevent intent creating on re-render (3 guards)
    if (paymentIntentCreated) return 
    if (cartItems.length < 0 || !mainAddress) return
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('payment_intent')) return

    const createPaymentIntent = async () => {
      const response: AxiosResponse<PaymentIntentResponse> = await api.post(
        '/payments/create-payment-intent', {
          items: cartItems,
          customerEmail,
          shippingAddress: mainAddress,
        }
      )

      setClientSecret(response.data.clientSecret)
    }

    createPaymentIntent()
    setPaymentIntentCreated(true)
  }, [cartItems, customerEmail, mainAddress, paymentIntentCreated])

  if (!mainAddress) return
  return (
    <div className='grid gap-6 p-4 max-w-[1440px] md:grid-cols-2 xl:mx-auto'>
      <div className='grid gap-6 '>
        {/* Address container */}
        <div className='flex flex-col gap-1 p-4 border border-primary rounded-sm'>
          <h2>Enviar a <span className='text-primary'>{mainAddress.fullName}</span></h2>

          <p className='text-sm'>{formatAdressLine(mainAddress)}</p>

          <div>
            <p className='text-xs text-gray-500 italic'>¿No es la ubicación que quieres?
              Cámbiala en la barra de navegación superior.
            </p>
          </div>
        </div>

        {/* Cart items with summary */}
        <div className='flex flex-col gap-6 border p-4 bg-accent rounded-md xl:p-6'>
          <CartItemList />

          <CheckoutSummary isCheckout/>
        </div>
        
      </div>

      {/* Stripe element */}
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance , loader }}>
            <CheckoutForm />
          </Elements>
        )}
    </div>
  )
}

export default CheckoutPage
