import ProductRating from '@/shared/components/ProductRating'
import { type Review } from '@/shared/types/productTypes'
import { HiUser } from 'react-icons/hi'

const Review = ({ review }: { review: Review }) => {
  const {
    rating,
    comment,
    reviewerName,
    date
  } = review

  const formatedDate = new Date(date).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  
  return (
    <div className='flex gap-4'>
      <div className='flex items-center justify-center rounded-full bg-gray-300 size-16'>
        <HiUser className='text-black/50 size-10'/>
      </div>

      <div className='flex flex-col items-start'>
        <div>
          <p className='inline-block mr-2'>{reviewerName}</p>

          <p className='text-sm font-extralight text-gray-400 inline-block '>{formatedDate}</p>
        </div>

        <ProductRating rating={rating} />

        <p className='text-gray-600'>{comment}</p>
      </div>
    </div>
  )
}

export default Review
