import { cn } from '@/shared/utils/utils'
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from 'react-icons/ti'

const ProductRating = ({ rating, className }: { rating: number, className?: string }) => {
  const ratingFixed = Math.floor(Number((rating * 10).toFixed(8))) / 10
  const ratingInt = Math.floor(ratingFixed)
  const decimalPart = Number((ratingFixed - ratingInt).toFixed(1))

  const isSignificant = decimalPart > 0 && decimalPart > 0.3
  const fillingStars = 5 - (Math.ceil(ratingFixed))
  
  return (
    <div className={cn('flex justify-center items-center text-primary', className)}>
      {Array.from({ length: ratingInt }).map((_, i: number) =>
        <TiStarFullOutline key={i} className='size-5'/>
      )}

      {isSignificant && <TiStarHalfOutline className='size-5' />}

      {Array.from({ length: fillingStars }).map((_, i: number) =>
        <TiStarOutline key={i} className='size-5' />
      )}
    </div>
  )
}

export default ProductRating