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
import { useEffect, useState } from 'react'
import PasswordStrengthMeter from '@/pages/signup/PasswordStrengthMeter'
import { HiEye, HiEyeOff } from 'react-icons/hi'

export default function SignupForm() {
  const [isVisiblePass, setIsVisiblePass] = useState(false)

  // Define form
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  })

  // Password value tracker
  const password = form.watch('password') || ''

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
      navigate('/verify-email')
    }

    dispatch(resetRegister())
  }, [isError, isSuccess, message, navigate, dispatch, form])

  if (isLoading) {
    return (
      <div className='rounded-full border-primary border-2 animate-spin'></div>
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
              <FormLabel className='sr-only'>Nombre</FormLabel>
              <FormControl>
                <Input maxLength={100} placeholder='Nombre completo' {...field} />
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
              <FormLabel className='sr-only'>E-mail</FormLabel>
              <FormControl>
                <Input maxLength={254} placeholder='E-mail' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>Contraseña</FormLabel>
              <div className='flex'>
                <FormControl>
                  <Input
                    className='pr-7'
                    maxLength={72}
                    type={isVisiblePass ? 'text' : 'password'}
                    placeholder='Contraseña'
                    {...field}
                  />
                </FormControl>

                <button
                  type='button'
                  className='btn -ml-6'
                  onClick={() => setIsVisiblePass(!isVisiblePass)}
                >
                  {isVisiblePass ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              <PasswordStrengthMeter password={password} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full'>
          Registrarse
        </Button>
      </form>
    </Form>
  )
}
