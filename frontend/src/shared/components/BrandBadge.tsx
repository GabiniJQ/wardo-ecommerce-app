import { cn } from '@/lib/utils'
import { Link } from 'react-router'

const BrandBadge = ({ brand, className }: { brand: string, className?: string }) => {
  return (
    <Link to={`/search?q=${brand}`} className={cn('w-full block', className)}>
      <span className='w-full bg-primary text-primary-foreground rounded text-sm p-1 block text-center'>
        {brand}
      </span>
    </Link> 
  )
}

export default BrandBadge
