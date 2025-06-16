import { useDispatch, useSelector } from 'react-redux'
import { confirmMerge, rejectMerge } from '@/features/cart/cartSlice'
import { AppDispatch, RootState } from '@/app/store'
import { fetchProductById } from '@/features/products/productsSlice'

const MergeCartDialog = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { mergeDialogOpen, tempMergeItems } = useSelector(
    (state: RootState) => state.cart
  )

  const guestItems = tempMergeItems?.map((item) => dispatch(fetchProductById(item.productId)))
  console.log(mergeDialogOpen)
  if (!mergeDialogOpen || !tempMergeItems) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg max-w-md'>
        <h3 className='text-lg font-bold mb-4'>Carrito recuperado</h3>
        <p>
          Encontramos {tempMergeItems.length} productos en tu carrito anterior.
          ¿Deseas combinarlos con tu carrito actual?
        </p>

        <div className='max-h-60 overflow-y-auto my-4 border-t border-b py-2'>
          {tempMergeItems.map((item) => (
            <div key={item._id ?? item.productId} className='flex items-center py-2'>
              {/* <img
                src={item.image}
                alt={item.name}
                className='w-10 h-10 object-cover mr-3'
              />
              <span>{item.name}</span> */}
              item: {item.productId }
            </div>
          ))}
        </div>

        <div className='flex justify-between mt-6'>
          <button
            onClick={() => dispatch(rejectMerge())}
            className='px-4 py-2 border border-gray-300 rounded'
          >
            Descartar
          </button>
          <button
            onClick={() => dispatch(confirmMerge())}
            className='px-4 py-2 bg-primary text-white rounded'
          >
            Combinar carritos
          </button>
        </div>
      </div>
    </div>
  )
}

export default MergeCartDialog
