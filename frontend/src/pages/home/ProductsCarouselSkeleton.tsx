import { Skeleton } from '@/shared/components/ui/skeleton'

const ProductsCarouselSkeleton = ({
  className,
  displayed,
}: {
  className?: string
  displayed: string
}) => {
  const length = displayed === 'full' ? 10 : 5

  return (
    <div className='flex flex-col gap-4'>
      <Skeleton className='h-4 w-52 mx-6' />
      <div className={`flex px-2 gap-4 ${className}`}>
        {Array.from({ length: length }).map((_, index) => (
          <div key={index} className='flex flex-col space-y-3  px-2'>
            <Skeleton className='h-[125px] w-[150px] rounded-xl' />
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
