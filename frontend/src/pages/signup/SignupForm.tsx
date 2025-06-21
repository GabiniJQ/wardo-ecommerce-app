import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { register, resetRegister } from '@/features/auth/authSlice'

import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { signupSchema } from '@/schemas/signupSchema'
import { AppDispatch, RootState } from '@/app/store'
import { useEffect } from 'react'
import { PasswordInputField } from '@/shared/components/PasswordInputField'

import useRecaptcha from '@/shared/hooks/useRecaptcha'
import ReCAPTCHA from 'react-google-recaptcha'
import Loader from '@/shared/components/Loader'

const recaptchaKey = 
  import.meta.env.VITE_RECAPTCHA_SITE_KEY || import.meta.env.VITE_RECAPTCHA_SITE_LOCALHOST_KEY

export default function SignupForm() {

  // Define form
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  })

  const { formState, clearErrors } = form

  const { recaptchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha()

  const navigate = useNavigate()

  // Dispatch functions
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth.register
  )

  // Define submit handler
  function onSubmit(values: z.infer<typeof signupSchema>) {
    const { name, email, password } = values

    const userData = {
      name,
      email,
      password,
      recaptchaToken,
    }

    dispatch(register(userData))
  }

  useEffect(() => {
    if (isError) {
      form.setError('password', {
        message: message
      })
    }

    if (isSuccess) {
      sessionStorage.setItem('justRegistered', 'true')
      if (recaptchaRef.current) recaptchaRef.current.reset()

      navigate('/verify-email')
    }

    dispatch(resetRegister())
  }, [isError, isSuccess, message, navigate, dispatch, form, recaptchaRef])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[300px]'>
        <Loader className='size-8' />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input
                  className='placeholder:text-sm'
                  maxLength={100}
                  placeholder='Ingresar nombre completo'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  className='placeholder:text-sm'
                  maxLength={254}
                  placeholder='Ingresar e-mail'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <PasswordInputField 
          control={form.control}
          label='Contraseña'
          name='password'
          formState={formState}
          placeholder='Ingresar contraseña'
          clearErrors={clearErrors}
        />

        <ReCAPTCHA 
          sitekey={recaptchaKey}
          onChange={handleRecaptcha}
        />

        <Button type='submit' className='w-full'>
          Registrarse
        </Button>
      </form>
    </Form>
  )
}
