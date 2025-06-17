import { Skeleton } from '@/shared/components/ui/skeleton'

const ProductsCarouselSkeleton = ({
  className,
  displayed,
}: {
  className?: string
  displayed: string
}) => {
  const length = displayed === 'full' ? 10 : 3

  return (
    <div className='flex flex-col gap-4'>
      {/* Header */}
      <Skeleton className='h-4 w-52 mx-6' />
      
      {/* Body */}
      <div className={`flex px-2 gap-4 ${className}`}>
        {Array.from({ length: length }).map((_, index) => (
          <div key={index} className='flex flex-col space-y-4  px-2'>
            {/* Product image */}
            <Skeleton className='h-[195px] w-[210px] rounded-xl' />

            {/* Product info */}
            <div className='space-y-2'>
              <Skeleton className='h-4' />
              <Skeleton className='h-4 ' />
              <Skeleton className='h-12 ' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductsCarouselSkeleton
