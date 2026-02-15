import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useStripe } from '@stripe/react-stripe-js'
import { CheckCircle, XCircle, Loader2, Package, ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import api from '@/lib/axios'
import { AxiosResponse } from 'axios'
import { Order, OrderItem, OrderResponse } from '@/shared/types/orderTypes'
import { Link } from 'react-router'
import { formattedPrice } from '@/shared/utils/utils'

const SuccessContent = () => {
  const stripe = useStripe()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  )
  const [message, setMessage] = useState('')
  const [orderDetails, setOrderDetails] = useState<Order | null>(null)

  useEffect(() => {
    if (!stripe) return

    const clientSecret = searchParams.get('payment_intent_client_secret')
    const paymentIntentId = searchParams.get('payment_intent')

    if (!clientSecret) {
      setStatus('error')
      setMessage('Confirmación de pago inválida')
      return
    }

    const verifyPayment = async (
      clientSecret: string,
      paymentIntentId: string | null,
    ) => {
      if (!stripe) return

      try {
        const { paymentIntent } =
          await stripe.retrievePaymentIntent(clientSecret)

        if (!paymentIntent) {
          setStatus('error')
          setMessage('Error en el pago')
          return
        }

        console.log('Payment Intent Status:', paymentIntent.status)

        switch (paymentIntent.status) {
          case 'succeeded':
            setStatus('success')
            setMessage('¡Pago procesado exitosamente!')
            await fetchOrderDetails(paymentIntentId || paymentIntent.id)
            break

          case 'processing':
            setStatus('loading')
            setMessage('Tu pago está siendo procesado...')
            // Poll for updates after 3 seconds
            setTimeout(() => verifyPayment(clientSecret, paymentIntentId), 3000)
            break

          case 'requires_payment_method':
            setStatus('error')
            setMessage('Hubo error en el pago. Por favor intenta nuevamente.')
            break

          default:
            setStatus('error')
            setMessage('Algo salió mal.')
            break
        }
      } catch (error) {
        console.error('Error verifying payment:', error)
        setStatus('error')
        setMessage('Error al verificar el estado del pago')
      }
    }

    verifyPayment(clientSecret, paymentIntentId)
  }, [stripe, searchParams])

  const fetchOrderDetails = async (paymentIntentId: string) => {
    try {
      const response: AxiosResponse<OrderResponse> = await api.get(
        `/orders/by-payment-intent/${paymentIntentId}`,
      )
      setOrderDetails(response.data.order)
      console.log('Order details fetched:', response.data.order)
    } catch (error) {
      console.error('Error fetching order details:', error)
    }
  }

  // Loading State
  if (status === 'loading') {
    return (
      <div className='flex flex-col items-center justify-center min-h-[500px] p-4'>
        <Loader2 className='w-16 h-16 animate-spin text-primary mb-4' />
        <h2 className='text-2xl font-semibold mb-2'>Procesando pago...</h2>
        <p className='text-gray-600 text-center max-w-md'>
          {message || 'Por favor espera un momento'}
        </p>
      </div>
    )
  }

  // Error State
  if (status === 'error') {
    return (
      <div className='max-w-2xl mx-auto p-4'>
        <div className='bg-white rounded-lg shadow-md p-8'>
          <div className='flex flex-col items-center text-center'>
            <XCircle className='w-16 h-16 text-red-500 mb-4' />
            <h2 className='text-2xl font-semibold mb-2 text-red-600'>
              Error en el pago
            </h2>
            <p className='text-gray-600 mb-6'>{message}</p>

            <div className='flex flex-col sm:flex-row gap-4 w-full'>
              <Button onClick={() => navigate('/checkout')} className='flex-1'>
                Intentar nuevamente
              </Button>
              <Button
                variant='outline'
                onClick={() => navigate('/')}
                className='flex-1'
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success State
  return (
    <div className='max-w-2xl mx-auto p-4'>
      <div className='bg-white rounded-lg shadow-md p-8'>
        {/* Success Icon and Message */}
        <div className='flex flex-col items-center text-center mb-8'>
          <div className='bg-green-100 rounded-full p-3 mb-4'>
            <CheckCircle className='w-12 h-12 text-green-600' />
          </div>
          <h2 className='text-3xl font-bold mb-2 text-green-600'>
            ¡Pago exitoso!
          </h2>
          <p className='text-gray-600 text-lg'>{message}</p>
        </div>

        {/* Order Details */}
        {orderDetails && (
          <div className='bg-gray-50 rounded-lg p-6 mb-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Package className='w-5 h-5 text-primary' />
              <h3 className='font-semibold text-lg'>Detalles de tu orden</h3>
            </div>

            <div className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Número de orden:</span>
                <span className='font-mono font-semibold'>
                  #{orderDetails._id && orderDetails._id.slice(-8).toUpperCase()}
                </span>
              </div>

              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Total pagado:</span>
                <span className='font-semibold text-lg'>
                  {formattedPrice(orderDetails.totalAmount)}
                </span>
              </div>

              {orderDetails.customerEmail && (
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Email de confirmación:</span>
                  <span className='font-medium'>
                    {orderDetails.customerEmail}
                  </span>
                </div>
              )}

              {orderDetails.items && orderDetails.items.length > 0 && (
                <div className='border-t pt-3 mt-3'>
                  <p className='text-sm text-gray-600 mb-2'>Productos:</p>
                  <div className='space-y-2'>
                    {orderDetails.items.map(
                      (item: OrderItem, index: number) => (
                        <div
                          key={index}
                          className='flex justify-between text-sm'
                        >
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>
                            {formattedPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Message */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
          <p className='text-sm text-blue-800'>
            📧 Hemos enviado una confirmación a tu correo electrónico con los
            detalles de tu orden.
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <Button onClick={() => navigate('/orders')} className='flex-1'>
            Ver mis órdenes
          </Button>
          <Button
            variant='outline'
            onClick={() => navigate('/')}
            className='flex-1'
          >
            Continuar comprando
          </Button>
        </div>

        {/* Back Link */}
        <div className='text-center mt-6'>
          <Link
            to='/'
            className='text-sm text-gray-600 hover:text-primary flex items-center justify-center gap-1'
          >
            <ArrowLeft className='w-4 h-4' />
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SuccessContent
