import { addAddressSchema } from '@/schemas/addAddressSchema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import citiesAndDepartments from '@shared/citiesAndDepartments.json'
import { useEffect, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store'
import { addAddress, changeAddress, resetAddAddress, resetChangeAddress } from '@/features/auth/authSlice'
import { ToastNotification, ToastNotificationMessage } from '@/shared/components/ToastNotification'
import Loader from '@/shared/components/Loader'
import { Address } from '@/shared/types/authTypes'
import { toast } from 'sonner'

const departments = Object.keys(citiesAndDepartments)

type AddressFormProps = {
  addressData?: Address
}

// Define the allowed types
const allowedTypes = ['hogar', 'trabajo', 'casillero'] as const
type AddressType = typeof allowedTypes[number]

type AddressFormData = z.infer<typeof addAddressSchema>

const AddressForm = ({ addressData }: AddressFormProps) => {
  const [availableCities, setAvailableCities] = useState<string[]>([])

  const addAddressLoading = useSelector(
    (state: RootState) => state.auth.addAddress.isLoading
  )
  const addAddressSuccess = useSelector(
    (state: RootState) => state.auth.addAddress.isSuccess
  )
  const addAddressError = useSelector(
    (state: RootState) => state.auth.addAddress.isError
  )
  const changeAddressLoading = useSelector(
    (state: RootState) => state.auth.changeAddress.isLoading
  )
  const changeAddressSuccess = useSelector(
    (state: RootState) => state.auth.changeAddress.isSuccess
  )
  const changeAddressError = useSelector(
    (state: RootState) => state.auth.changeAddress.isError
  )
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()

  const defaultValues: AddressFormData = addressData
  ? {
      fullName: addressData.fullName ?? '',
      addressType: allowedTypes
        .includes(addressData.addressType as AddressType)
          ? (addressData.addressType as AddressType)
          : 'hogar',
      addressInfo: {
        street: addressData.addressInfo.street ?? '',
        number1: addressData.addressInfo.number1 ?? '',
        number2: addressData.addressInfo.number2 ?? '',
        additionalInfo: addressData.addressInfo.additionalInfo ?? '',
        postalCode: addressData.addressInfo.postalCode ?? '',
      },
      department: addressData.department ?? '',
      city: addressData.city ?? '',
      phone: addressData.phone ?? '',
    }
  : {
      fullName: '',
      addressType: 'hogar',
      addressInfo: {
        street: '',
        number1: '',
        number2: '',
        additionalInfo: '',
        postalCode: '',
      },
      department: '',
      city: '',
      phone: '',
    }

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addAddressSchema),
    defaultValues,
  })

  const departmentValue = form.watch('department')

  const onSubmit = (values: AddressFormData) => {
    if (!user?._id) return
    const {
      fullName,
      addressType,
      addressInfo,
      city,
      department,
      phone,
    } = values

    const address = {
      fullName,
      addressType,
      addressInfo,
      city,
      department,
      phone,
    }

    if (!addressData) {
      dispatch(addAddress({
        userId: user._id, address,
      }))

      form.reset()
    } else {
      dispatch(changeAddress({
        userId: user._id, address: { ...address, _id: addressData._id}
      }))

      form.reset()
    }
  }

  useEffect(() => {
    form.resetField('city')
    if (departmentValue) {
      const cities = citiesAndDepartments[departmentValue] as string[]
      setAvailableCities(cities)
    } 
  }, [departmentValue, form])

  useEffect(() => {
    if (addAddressSuccess) {
      toast(
        <ToastNotification className='text-primary'>
          <ToastNotificationMessage type='success'>
            Dirección añadida exitosamente
          </ToastNotificationMessage>
        </ToastNotification>
      )
      dispatch(resetAddAddress())
    }

    if (addAddressError) {
      toast(
        <ToastNotification className='text-red-500'>
          <ToastNotificationMessage type='error'>
            Error al añadir dirección
          </ToastNotificationMessage>
        </ToastNotification>
      )
    }

    if (changeAddressSuccess) {
      toast(
        <ToastNotification className='text-primary'>
          <ToastNotificationMessage type='success'>
            Dirección actualizada exitosamente
          </ToastNotificationMessage>
        </ToastNotification>
      )
      dispatch(resetChangeAddress())
    }

    if (changeAddressError) {
      toast(
        <ToastNotification className='text-red-500'>
          <ToastNotificationMessage type='error'>
            Error al actualizar dirección
          </ToastNotificationMessage>
        </ToastNotification>
      )
    }
  }, [
    addAddressError,
    addAddressSuccess,
    changeAddressSuccess,
    changeAddressError,
    dispatch
  ])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}  className='space-y-6'>
        <div className='sm:grid sm:grid-cols-2 gap-6 space-y-6 sm:space-y-0'>
          <div className='space-y-6'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='field-required'>Nombre de quien recibe</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='addressType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de dirección</FormLabel>
                  <FormControl>
                    <Select defaultValue='Hogar' onValueChange={field.onChange} value={field.value as string}>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Hogar' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='hogar'>Hogar</SelectItem>
                        <SelectItem value='trabajo'>Trabajo</SelectItem>
                        <SelectItem value='casillero'>Casillero</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-3 gap-2'>
              <FormField
                control={form.control}
                name='addressInfo.street'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-required'>Calle</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='addressInfo.number1'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>#</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='addressInfo.number2'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>-</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='addressInfo.additionalInfo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Información adicional</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='space-y-6'>
            <FormField
              control={form.control}
              name='department'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='field-required'>Departamento</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='min-w-40'>
                        <SelectValue placeholder='Seleccionar departamento' />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((department) => 
                          <SelectItem key={department} value={department}>{department}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='city'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='field-required'>Ciudad o municipio</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={availableCities.length === 0}
                    >
                      <SelectTrigger className='min-w-40'>
                        <SelectValue placeholder='Selecciona tu ciudad' />
                      </SelectTrigger>
                      <SelectContent >
                        {availableCities.map((city) => 
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='addressInfo.postalCode'
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Código postal</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem >
                  <FormLabel className='field-required'>Teléfono móvil</FormLabel>
                  <div className='flex'>
                    <div
                      className='flex items-center leading-0 justify-center border-input border border-r-gray-100 rounded rounded-r-none p-1'
                    >
                      +57
                    </div>
                    <FormControl>
                      <Input {...field} className='border-l-0 rounded-l-none px-2' />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
          type='submit'
          className='w-full sm:max-w-40 sm:mx-auto sm:block'
        >
          {addAddressLoading || changeAddressLoading
          ? <Loader className='size-4' />
          : addressData ? 'Guardar cambios' : 'Añadir dirección'
          }
        </Button>
      </form>
    </Form>
  )
}

export default AddressForm
