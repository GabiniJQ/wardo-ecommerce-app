import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import { loginSchema } from '@/schemas/loginSchema'
import { useDispatch, useSelector } from 'react-redux'
import { login, resetLogin } from '@/features/auth/authSlice'
import { AppDispatch, RootState } from '@/app/store'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import Loader from '@/shared/components/Loader'
import { ROUTES } from '@/consts/routes'

export default function LoginForm() {
  // Define form
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const { clearErrors  } = form

  // Dispatch function and Auth States
  const dispatch = useDispatch<AppDispatch>()
  const { isSuccess, isError, isLoading, message } = useSelector((state: RootState) => state.auth.login)
  const navigate = useNavigate()

  // Define submit handler
  function onSubmit(values: z.infer<typeof loginSchema>) {
    const { email, password } = values
    const userData = {
      email,
      password,
    }

    dispatch(login(userData))
  }

  useEffect(() => {
    if (isError) {
      form.setError('email', { message: '' })
      form.setError('password', { message })
    }

    if (isSuccess) {
      navigate(-1)

      setTimeout(() => dispatch(resetLogin()), 1000)
      
    }
  }, [isError, isSuccess, navigate, dispatch, form, message])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-w-20'>
        <Loader />
      </div>
    )
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 min-h-40'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input 
                  placeholder='Ingresa tu E-mail'
                  {...field}
                  onChange={(e) => {
                    clearErrors(['email', 'password'])
                    field.onChange(e)
                  }}
                  
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input 
                    type='password'
                    placeholder='Ingresa tu contraseña'
                    {...field}
                    onChange={(e) => {
                      clearErrors(['email', 'password'])
                      field.onChange(e)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className='text-sm link text-primary'
          >
            Olvidé mi contraseña
          </Link>
        </div>

        <Button type='submit' className='w-full'>
          Ingresar
        </Button>
      </form>
    </Form>
  )
}
