import { cn } from '@/shared/utils/utils'

const Loader = ({ className }: {className?: string}) => {
  return (
    <span className={cn('size-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin',
      className
    )}></span>
  )
}

export default Loader
