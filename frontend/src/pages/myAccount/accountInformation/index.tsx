import { AppDispatch, RootState } from '@/app/store'
import Loader from '@/shared/components/Loader'
import { ToastNotification, ToastNotificationMessage } from '@/shared/components/ToastNotification'
import { Button } from '@/shared/components/ui/button'
import { Form } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { changeName, changePassword } from '@/features/auth/authSlice'
import { newPassSchema } from '@/schemas/newPassSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { z } from 'zod'
import BackButton from '@/shared/components/BackButton'
import { PasswordInputField } from '@/shared/components/PasswordInputField'

const AccountInformationPage = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const { isLoading, isSuccess, isError } = useSelector(
    (state: RootState) => state.auth.changeName
  )
  const passIsLoading = useSelector((state: RootState) => 
    state.auth.changePassword.isLoading
  )
  const passIsSuccess = useSelector((state: RootState) => state.auth.changePassword.isSuccess)
  const passErrorMessage = useSelector((state: RootState) => state.auth.changePassword.errorMessage)
  const passErrorCode = useSelector((state: RootState) => state.auth.changePassword.errorCode)

  const [nameInput, setNameInput] = useState<string | undefined >(user?.name)

  const newPassForm = useForm<z.infer<typeof newPassSchema>>({
    resolver: zodResolver(newPassSchema),
    defaultValues: {
      currentPass: '',
      newPass: '',
      newPassConfirmation: '',
    }
  })
  
  const { formState } = newPassForm

  const dispatch = useDispatch<AppDispatch>()
  
  const onSubmit = (values: z.infer<typeof newPassSchema>) => {
    const { currentPass, newPass } = values
    const passData = {
      currentPass,
      newPass,
    }

    if (user?._id) {
      dispatch(changePassword({ userId: user._id, passData }))
    }
  }

  useEffect(() => {
    if (isSuccess) {
      toast(
        <ToastNotification className='text-primary'>
          <ToastNotificationMessage type='success'>
            Nombre actualizado exitosamente
          </ToastNotificationMessage>
        </ToastNotification>
      )
    }
    
    if (isError) {
      toast(
        <ToastNotification className='text-red-500'>
          <ToastNotificationMessage type='error'>
            Error al cambiar nombre
          </ToastNotificationMessage>
        </ToastNotification>
      )
    }

    if (passIsSuccess) {
      toast(
        <ToastNotification className='text-primary'>
          <ToastNotificationMessage type='success'>
            Contraseña actualizada exitosamente
          </ToastNotificationMessage>
        </ToastNotification>
      )

      newPassForm.reset()
    }

    if (passErrorMessage !== '') {
      switch (passErrorCode) {
        case 'INCORRECT_PASSWORD':
          newPassForm.setError('currentPass', {
            type: 'manual',
            message: 'La contraseña actual es incorrecta',
          })
          break
        case 'SAME_PASSWORD':
          newPassForm.setError('newPass', {
            type: 'manual',
            message: 'La nueva contraseña debe ser diferente a la actual',
          })
          break
        case 'FIELDS_REQUIRED':
          newPassForm.setError('currentPass', { type: 'manual', message: 'Campo requerido' })
          newPassForm.setError('newPass', { type: 'manual', message: 'Campo requerido' })
          break
        default:
          // General error
          newPassForm.setError('root', {
            type: 'manual',
            message: 'Hubo un error al cambiar la contraseña',
          })
      }
    }
  }, [isSuccess, isError, passErrorMessage, passIsSuccess, newPassForm, passErrorCode])
  
  return (
    <div className='flex flex-col gap-5 mb-10'>
      <BackButton />

      <div className='sm:grid sm:grid-cols-2 xl:grid-cols-3 gap-10 '>
        <div className='flex flex-col gap-6 '>
          <div className='flex flex-col gap-2'>
            <Label htmlFor=''>Nombre completo</Label>

            <Input
              name='name' 
              placeholder='Nombre completo'
              value={nameInput}
              onChange={(e) => setNameInput(e.currentTarget.value)}
              maxLength={100}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor=''>Email</Label>

            <Input 
              value={user?.email}
              disabled
            />
          </div>

          <Button
            onClick={() => {
              if (user && nameInput && nameInput.trim() !== user.name) {
                dispatch(changeName({ newName: nameInput, userId: user._id}))
              }
            }}
          >
            {
              isLoading ? <Loader className='size-4'/> : 'Guardar cambios'
            }
          </Button>
        </div>

        <div className='flex flex-col gap-4'>
          <h2 className='text-lg text-primary font-semibold'>Cambio de contraseña</h2>

          <Form {...newPassForm}>
            <form onSubmit={newPassForm.handleSubmit(onSubmit)} className='space-y-6'>
              <PasswordInputField 
                control={newPassForm.control}
                name='currentPass'
                label='Contraseña actual'
                formState={formState}
              />

              <PasswordInputField 
                control={newPassForm.control}
                name='newPass'
                label='Contraseña nueva'
                formState={formState}
              />

              <PasswordInputField 
                control={newPassForm.control}
                name='newPassConfirmation'
                label='Confirmar contraseña nueva'
                formState={formState}
              />
              
              <Button className='w-full' type='submit'>
                {
                  passIsLoading ? <Loader className='size-4'/> : 'Cambiar contraseña'
                }
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default AccountInformationPage
