import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import SuccessContent from './SuccessContent'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store'
import { clearUserCart } from '@/features/cart/cartSlice'
import { useEffect } from 'react'

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const SuccessPage = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()

  // Clear user cart on Payment Success
  useEffect(() => {
    if (user) dispatch(clearUserCart(user?._id))
  }, [user, dispatch])

  const appearance = {
    theme: 'stripe' as const,
  }

  return (
    <Elements stripe={stripePromise} options={{ appearance }}>
      <SuccessContent />
    </Elements>
  )
}

export default SuccessPage
