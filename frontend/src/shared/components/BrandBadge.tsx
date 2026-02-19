import { cn } from '@/lib/utils'
import { Link } from 'react-router'

const BrandBadge = ({ brand, className }: { brand: string, className?: string }) => {
  return (
    <Link to={`/search?q=${brand}`} className={cn('w-full block', className)}>
      <span className='w-fit px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm block text-center md:text-base'>
        {brand}
      </span>
    </Link> 
  )
}

export default BrandBadge
