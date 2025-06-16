import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/utils/utils'
import { HiPlusCircle } from 'react-icons/hi'
import { Link } from 'react-router'

type AddAddressButtonProps = {
  className?: string
  path: string
}

const AddAddressButton = (
    { className, path, ...props }: AddAddressButtonProps & React.ComponentProps<"button">
  ) => {
  return (
    <Link to={path} >
      <Button
        className={cn('text-primary btn', className)}
        variant='outline'
        {...props}
      >
        <HiPlusCircle />
        Agregar dirección
      </Button>
    </Link>
  )
}

export default AddAddressButton
