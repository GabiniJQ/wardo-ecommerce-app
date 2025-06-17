import { Skeleton } from '@/shared/components/ui/skeleton'

const ProductCardDetailedSkeleton = () => {
  return (
    <div className='flex gap-2 h-[400px] rounded shadow p-2 bg-white'>
      <Skeleton className='w-1/2'/>
      <div className='flex flex-col gap-4 w-1/2'>
        <Skeleton className='h-1/5'/>
        <Skeleton className='h-1/5'/>
        <Skeleton className='h-1/5'/>
        <Skeleton className='h-4/5'/>
        <Skeleton className='h-1/5'/>
      </div>
    </div>
  )
}

export default ProductCardDetailedSkeleton
