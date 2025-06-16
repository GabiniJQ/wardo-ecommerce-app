import { Button } from '@/shared/components/ui/button'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router'

const BackButton = () => {
  const navigate = useNavigate()

  return (
    <Button
      variant='ghost'
      className='text-primary w-20'
      onClick={() => navigate(-1)}
    >
      <HiArrowLeft />
      Volver
    </Button>
  )
}

export default BackButton
