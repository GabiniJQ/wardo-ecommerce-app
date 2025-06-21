import { AppDispatch, RootState } from '@/app/store'
import { ROUTES } from '@/consts/routes'
import { checkResetPasswordToken, resetPassword } from '@/features/auth/authSlice'
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema'
import Loader from '@/shared/components/Loader'
import { PasswordInputField } from '@/shared/components/PasswordInputField'
import { Button } from '@/shared/components/ui/button'
import { Form } from '@/shared/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { z } from 'zod'

type FormType = z.infer<typeof resetPasswordSchema>

const ResetPasswordPage = () => {
  const { token } = useParams()

  const user = useSelector((state: RootState) => state.auth.user)
  const checkTokenError = useSelector(
    (state: RootState) => state.auth.checkPasswordToken.isError
  )
  const resetPasswordLoading = useSelector(
    (state: RootState) => state.auth.resetPassword.isLoading
  )

  const form = useForm<FormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPass: '',
      newPassConfirmation: '',
    }
  })

  const { formState, clearErrors } = form
  
  const dispatch = useDispatch<AppDispatch>()

  const navigate = useNavigate()

  const onSubmit = (values: FormType) => {
    const { newPass } = values
    
    if (token) {
      const resetPasswordData = {
        password: newPass,
        token,
      }

      dispatch(resetPassword(resetPasswordData))
    }
  }

  useEffect(() => {
    if (token) {
      dispatch(checkResetPasswordToken(token))
    }
  }, [token, dispatch])

  useEffect(() => {
    if (user?._id) {
      navigate('/')
    }

    if (checkTokenError) {
      navigate(ROUTES.FORGOT_PASSWORD)
    }
  }, [token, dispatch, user, navigate, checkTokenError])

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <PasswordInputField
            control={form.control}
            name='newPass'
            label='Contraseña nueva'
            formState={formState}
            clearErrors={clearErrors}
          />

          <PasswordInputField
            control={form.control}
            name='newPassConfirmation'
            label='Confirmar contraseña nueva'
            formState={formState}
            clearErrors={clearErrors}
          />

          <Button
            className='w-full'
          >
            {
              resetPasswordLoading
                ? <Loader className='size-4' />
                : 'Cambiar contraseña'
            }
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ResetPasswordPage
