import { cn } from '@/lib/utils'
import { Skeleton } from '@/shared/components/ui/skeleton'

const ProductCardDetailedSkeleton = (
  { className, orientation = 'horizontal' }: { className?: string, orientation?: string }
) => {
  return (
    <div className={cn('flex gap-2 h-[400px] rounded shadow p-2 bg-white', 
        orientation === 'vertical' && 'grid',
        className)}>
      <Skeleton className={`${orientation === 'horizontal' ? 'w-1/2' : ''}`}/>
      <div className={cn('flex flex-col gap-4',
        orientation === 'horizontal' && 'w-1/2',
      )}>
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
