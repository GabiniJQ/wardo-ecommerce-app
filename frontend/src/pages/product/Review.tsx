import ProductRating from '@/shared/components/ProductRating'
import { type Review } from '@/shared/types/productTypes'

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
    <div className='flex flex-col items-start'>
      <div className=''>
        <p className='inline-block mr-2'>{reviewerName}</p>

        <p className='text-sm font-extralight text-gray-400 inline-block '>{formatedDate}</p>
      </div>

      <ProductRating rating={rating} />

      <p className='text-gray-600'>{comment}</p>
      
    </div>
  )
}

export default Review
