import { ROUTES } from '@/consts/routes'
import { selectMainAddress } from '@/features/checkout/checkoutSelectors'
import { Button } from '@/shared/components/ui/button'
import formatAdressLine from '@/shared/utils/formatAddressLine'
import { HiPlusCircle } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const AddressContainer = () => {
  const mainAddress = useSelector(selectMainAddress)
  const navigate = useNavigate()

  return (
    <div className='flex flex-col gap-1 p-4 border border-primary rounded-sm'>
      {mainAddress ? (
        <>
          <h2>
            Enviar a{' '}
            <span className='text-primary'>{mainAddress?.fullName}</span>
          </h2>

          <p className='text-sm'>
            {mainAddress ? formatAdressLine(mainAddress) : ''}
          </p>

          <div>
            <p className='text-xs text-gray-500 italic'>
              ¿No es la ubicación que quieres? Cámbiala en la barra de
              navegación superior.
            </p>
          </div>
        </>
      ) : (
        <>
          <p className=' text-red-700 italic'>
            Debes añadir una dirección de entrega primero.
          </p>

          <div onClick={() => navigate(ROUTES.ADDRESSES_ADD)}>
            <Button className='text-primary' variant='outline'>
              <HiPlusCircle />
              Agregar dirección
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default AddressContainer
