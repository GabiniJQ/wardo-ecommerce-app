import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { HiLocationMarker, HiPencil, HiPlusCircle } from 'react-icons/hi'

import { Address } from '@/shared/types/authTypes'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { changeMainAddress } from '@/features/auth/authSlice'
import Loader from '@/shared/components/Loader'
import { toast } from 'sonner'
import { ToastNotification, ToastNotificationButton, ToastNotificationMessage } from '@/shared/components/ToastNotification'
import { ROUTES } from '@/consts/routes'
import { AddressOption, AddressOptionAction, AddressOptionIcon, AddressOptionInfo } from '@/shared/components/AddressOption'

const AddressesModal = ({ defaultOpen }: { defaultOpen?: boolean }) => {
  const { user } = useSelector((state: RootState) => state.auth)
  const changeMainLoading = useSelector(
    (state: RootState) => state.auth.changeMainAddress.isLoading
  )
  const changeMainSuccess = useSelector(
    (state: RootState) => state.auth.changeMainAddress.isSuccess
  )

  const mainAddress = user?.addresses.find((address) => address.isMain === true)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    mainAddress?._id || ''
  )
  const navigate = useNavigate()

  const   addresses = user?.addresses
  const getMainAddress = () => {
    if (user && user.addresses.length > 0) {
      const mainAddress = user.addresses.find(
        (address: Address) => address.isMain === true
      )

      if (mainAddress) {
        const textAddress
          = `Calle ${mainAddress.addressInfo.street} #${mainAddress.addressInfo.number1} - ${mainAddress.addressInfo.number2}`
        return textAddress
      } 
    } else return 'Ingresar ubicación'
  }

  const dispatch = useDispatch<AppDispatch>()

  const handleSaveChanges = () => {
    const currentMain = user?.addresses.find((address) => address.isMain)
    if (
      !user?._id 
      || !selectedAddressId
      || selectedAddressId === currentMain?._id
    ) return

    dispatch(changeMainAddress({
      userId: user._id,
      newMainId: selectedAddressId,
    }))
  }

  useEffect(() => {
    if (changeMainSuccess) {
      toast(
        <ToastNotification className='text-primary'>
          <ToastNotificationMessage type='success'>
            Dirección principal actualizada
          </ToastNotificationMessage>

          <ToastNotificationButton to={ROUTES.ADDRESSES}>
            Ver direcciones
          </ToastNotificationButton>
        </ToastNotification>
      )
    }
  }, [changeMainSuccess])

  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger
        className='h-full'
        onClick={() => {
          if (!user?._id) navigate('/login')
        }}
      >
        <div className='flex justify-center items-center gap-1 h-full cursor-pointer hover:underline'>
          <HiLocationMarker />

          <div
            className={`${
              user
                ? 'flex flex-col xl:gap-2 justify-center xl:flex-row items-start'
                : ''
            } leading-3 w-full`}
          >
            <p className={`text-sm  m-0 `}>
              {user ? getMainAddress() : 'Ingresar ubicación'}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[525px] w-3/4'>
        <DialogHeader className='text-left'>
          <DialogTitle>Selecciona la dirección de envío</DialogTitle>
          <DialogDescription>
            Calcula costos y tiempo de entrega agregando una dirección de envío.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div>
            {
              user?._id && user.addresses.length > 0 ? (
                <Button className='text-primary btn' variant='outline'>
                  <HiPencil />
                  Editar direcciones
                </Button>
              ) : (
                <DialogClose onClick={() => navigate(ROUTES.ADDRESSES_ADD)}>
                  <span
                    className='flex items-center gap-2 text-primary text-sm border px-3 py-2 rounded btn'
                  >
                    <HiPlusCircle />
                    Agregar dirección
                  </span>
                </DialogClose>
              )
            }
          </div>
          
          <div className='flex flex-col gap-4'>
            {addresses && addresses.map((address) => {
              return (
                <AddressOption
                  address={address} 
                  key={address._id} 
                  onSelect={() => setSelectedAddressId(address._id)}
                  className={`${selectedAddressId === address._id ? 'border-primary' : ''}`}
                >
                  <AddressOptionIcon className='w-[10%]' />
                  <AddressOptionInfo />
                  <AddressOptionAction className='w-[10%]' >
                    <Input 
                      type='radio' 
                      className='size-4 justify-self-center self-center btn' 
                      name='address'
                      checked={selectedAddressId === address._id}
                      readOnly
                    />
                  </AddressOptionAction>
                </AddressOption>
              )
            })}
          </div>
        </div>
        {user && user.addresses.length > 0 && (
          <DialogFooter className='lg:justify-center'>
            <DialogClose
              className='bg-primary text-primary-foreground p-2 text-sm rounded btn hover:bg-primary/90'
              onClick={() => handleSaveChanges()}
            >
              {
                changeMainLoading
                  ? <Loader className='size-4' />
                  : 'Guardar cambios'
              }
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AddressesModal
