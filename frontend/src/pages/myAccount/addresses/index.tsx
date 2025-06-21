import { AppDispatch, RootState } from '@/app/store'
import { ROUTES } from '@/consts/routes'
import { changeMainAddress, deleteAddress } from '@/features/auth/authSlice'
import AddAddressButton from '@/shared/components/AddAddressButton'
import { AddressOption, AddressOptionAction, AddressOptionIcon, AddressOptionInfo } from '@/shared/components/AddressOption'
import Loader from '@/shared/components/Loader'
import { ToastNotification, ToastNotificationMessage } from '@/shared/components/ToastNotification'
import { Button } from '@/shared/components/ui/button'
import { Address } from '@/shared/types/authTypes'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'

const AddressesPage = () => {
  const [currentDelete, setCurrentDelete] = useState('')

  const addresses = useSelector((state: RootState) => state.auth.user?.addresses)
  const user = useSelector((state: RootState) => state.auth.user)
  const changeMainLoading = useSelector(
    (state: RootState) => state.auth.changeMainAddress.isLoading
  )
  const deleteAddressLoading = useSelector((state: RootState) => 
    state.auth.deleteAddress.isLoading
  )
  const deleteAddressSuccess = useSelector((state: RootState) => 
    state.auth.deleteAddress.isSuccess
  )
  const deleteAddressError = useSelector((state: RootState) => 
    state.auth.deleteAddress.isError
  )

  const dispatch = useDispatch<AppDispatch>()

  const handleSetMainAddress = (currentAddress: Address) => {
    if (!user?._id) return

    dispatch(changeMainAddress({
      userId: user._id,
      newMainId: currentAddress._id
    }))
  }

  const navigate = useNavigate()
  const location = useLocation()

  const handleDelete = (addressId: string) => {
    if (user) {
      dispatch(deleteAddress({
        userId: user._id, addressId, 
      }))

      setCurrentDelete(addressId)
    }
  }

  useEffect(() => {
    if (deleteAddressSuccess) {
      <ToastNotification className='text-mustard-primary'>
        <ToastNotificationMessage type='alert'>
          Dirección eliminada exitosamente
        </ToastNotificationMessage>
      </ToastNotification>
    }

    if (deleteAddressError) {
      <ToastNotification className='text-red-500'>
        <ToastNotificationMessage type='error'>
          Error al eliminar dirección
        </ToastNotificationMessage>
      </ToastNotification>
    }
  }, [deleteAddressSuccess, deleteAddressError])

  return (
    <div className='flex flex-col gap-6'>
      {user?.addresses.length === 0 && (
        <p>Comienza agregando una dirección de envío</p>
      )}

      <div className=''>
        <AddAddressButton path={ROUTES.ADDRESSES_ADD} />
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        {addresses?.map((address) => (
          <AddressOption
            address={address}
            key={address._id}
            className={`hover:bg-white hover:cursor-default min-h-38
              ${address.isMain ? 'border-primary' : ''} `
            }
          >
            <AddressOptionIcon className='w-[20%]'/>
            <AddressOptionInfo />
            <AddressOptionAction
              className='flex-col p-2 gap-2 min-w-[30%] max-w-[220px]'
            >
              {!address.isMain && (
                <Button
                  className='w-full'
                  onClick={() => handleSetMainAddress(address)}
                  disabled={changeMainLoading}
                >
                  Elegir principal
                </Button>
              )}

              <Button 
                className='w-full'
                onClick={() => navigate(`${location.pathname}/${address._id}`)}
              >
                Editar
              </Button>

              <Button
                variant='destructive'
                className='w-full'
                onClick={() => handleDelete(address._id)}
              >
                {deleteAddressLoading && currentDelete === address._id
                  ? <Loader className='size-4' />
                  : 'Eliminar' }
              </Button>
            </AddressOptionAction>
          </AddressOption>
        ))}
      </div>
    </div>
  )
}

export default AddressesPage
