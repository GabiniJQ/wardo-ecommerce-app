import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router'

const BackButton = ({ className }: { className?: string }) => {
  const navigate = useNavigate()

  return (
    <Button
      variant='ghost'
      className={cn('text-primary w-6 sm:w-20', className)}
      onClick={() => navigate(-1)}
    >
      <HiArrowLeft className='size-5 sm:size-6'/>
    </Button>
  )
}

export default BackButton
