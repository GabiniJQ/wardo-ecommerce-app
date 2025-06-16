import AddressForm from '@/shared/components/AddressForm'
import BackButton from '@/shared/components/BackButton'

const AddressAddPage = () => {
  return (
    <div className='flex flex-col gap-6'>
      <BackButton />

      <h2 className='subtitle text-primary'>Añadir dirección</h2>

      <AddressForm />
    </div>
  )
}

export default AddressAddPage
