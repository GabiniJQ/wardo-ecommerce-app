import { RootState } from '@/app/store'
import { selectMainAddress } from '@/features/checkout/checkoutSelectors'
import CheckoutSummary from '@/pages/cart/CheckoutSummary'
import CartItemList from '@/shared/components/CartItemList'
import { Elements } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Appearance, loadStripe } from '@stripe/stripe-js'
import { selectCartItems } from '@/features/cart/cartSelectors'
import { AxiosResponse } from 'axios'
import { PaymentIntentResponse } from '@/shared/types/paymentTypes'
import api from '@/lib/axios'
import CheckoutForm from '@/pages/checkout/CheckoutForm'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/consts/routes'
import AddressContainer from '@/pages/checkout/AddressContainer'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntentCreated, setPaymentIntentCreated] = useState(false)
  console.log(paymentIntentCreated)
  const cartItems = useSelector(selectCartItems)
  const mainAddress = useSelector(selectMainAddress)
  const customerEmail = useSelector((state: RootState) => state.auth.user?.email)
  const { user } = useSelector((state: RootState) => state.auth)
  const isChecked = useSelector((state: RootState) => state.auth.checkAuth.isChecked)

  const navigate = useNavigate()

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

  // Redirect if no user logged in
  useEffect(() => {
    if (isChecked && !user?._id) navigate(ROUTES.LOGIN)
  }, [user, navigate, isChecked])

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart')
    }
  }, [cartItems, navigate])

  useEffect(() => {
    // Prevent intent creating on re-render (3 guards)
    if (paymentIntentCreated) return 
    if (cartItems.length < 1 || !mainAddress) return
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

  return (
    <div className='grid gap-6 p-4 max-w-[1440px] md:grid-cols-2 xl:mx-auto'>
      <div className='grid gap-6 '>
        {/* Address container */}
        <AddressContainer />

        {/* Cart items with summary */}
        <div className='flex flex-col gap-6 border p-4 bg-accent rounded-md xl:p-6'>
          <CartItemList />

          <CheckoutSummary isCheckout/>
        </div>
        
      </div>

      {/* Stripe element */}
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance , loader }}>
            <CheckoutForm setPaymentIntentCreated={setPaymentIntentCreated} />
          </Elements>
        )}
    </div>
  )
}

export default CheckoutPage
