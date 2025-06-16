import { AppDispatch, RootState } from '@/app/store'
import { forgotPassword, resetForgotPassword } from '@/features/auth/authSlice'
import forgotPasswordSchema from '@/schemas/forgotPasswordSchema'
import Loader from '@/shared/components/Loader'
import { ToastNotification, ToastNotificationMessage } from '@/shared/components/ToastNotification'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

const ForgotPassWordPage = () => {
  const [emailInput, setEmailInput] = useState({
    email: '',
    isError: false,
  })

  const { isError, isLoading, isSuccess, message, sentEmail } = useSelector(
    (state: RootState) => state.auth.forgotPassword
  )

  const dispatch = useDispatch<AppDispatch>()

  const handleSubmit = (email: string) => {
    if (!email) return

    dispatch(resetForgotPassword())

    const result = forgotPasswordSchema.safeParse(email)

    if (!result.success) {
      setEmailInput((prev) => ({
        ...prev,
        isError: true,
      }))
    } else {
      // Reset local input validation state
      setEmailInput((prev) => ({
        ...prev,
        isError: false,
      }))

      // Dispatch function
      dispatch(forgotPassword(email))
    }
  }

  useEffect(() => {
    if (isError || isSuccess) {
      toast(
        <ToastNotification
          className={`${isError ? 'text-red-500' : 'text-primary'}`}
        >
          <ToastNotificationMessage
            type={`${isError ? 'error' : 'success'}`}
          >
            {isError ? message : `${message} ${sentEmail}`}
          </ToastNotificationMessage>
        </ToastNotification>
      )
      dispatch(resetForgotPassword())
    }
  }, [isError, isSuccess, sentEmail, message, dispatch])

  return (
    <div className='flex flex-col justify-center items-center gap-6'>
      
      <h2 className='md:text-lg'>
        Introduce el email relacionado a tu cuenta y sigue los pasos del correo
      </h2>

      {isSuccess && (
        <p className='self-start text-gray-500'>
          {message}
          <span className='text-primary'>{sentEmail}</span>
        </p>
      )}

      <div className='flex flex-col gap-6 w-full'>
        <div className='flex flex-col gap-2'>
          <Input
            placeholder='Ingresa tu email vinculado'
            value={emailInput.email}
            onChange={(e) => {
              const value = e.currentTarget.value
              setEmailInput((prev) => ({
                ...prev,
                email: value
              }))
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(emailInput.email)
                setEmailInput((prev) => ({
                  ...prev,
                  email: ''
                }))
              }
            }}
          />

          {emailInput.isError && (
            <p className='text-red-500 text-sm'>
              Email ingresado no válido
            </p>
          )}
        </div>

        <Button
          type='submit'
          onClick={() => {
            handleSubmit(emailInput.email)
            setEmailInput((prev) => ({
              ...prev,
              email: ''
            }))
          }}
        >
          {
            isLoading 
              ? <Loader className='size-4' />
              : 'Enviar solicitud'
          }
        </Button>
      </div>
    </div>
  )
}

export default ForgotPassWordPage
