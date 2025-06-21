import AddressForm from '@/shared/components/AddressForm'

const AddressAddPage = () => {
  return (
    <div className='flex flex-col gap-6'>

      <h2 className='subtitle text-primary'>Añadir dirección</h2>

      <AddressForm />
    </div>
  )
}

export default AddressAddPage
