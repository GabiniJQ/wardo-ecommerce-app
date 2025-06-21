import { RootState } from '@/app/store'
import AddressForm from '@/shared/components/AddressForm'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

const AddressEditPage = () => {
  const { addressId } = useParams()

  const addresses = useSelector((state: RootState) => 
    state.auth.user?.addresses
  )

  const address = addresses?.find((address) => address._id === addressId)

  if (!address || !addressId) return

  return (
    <div className='flex flex-col gap-6'>
      <AddressForm addressData={address}/>
    </div>
  )
}

export default AddressEditPage
