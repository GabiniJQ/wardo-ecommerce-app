import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/utils/utils'
import { ReactNode } from 'react'
import { HiCheckCircle, HiExclamation, HiInformationCircle, HiXCircle } from 'react-icons/hi'
import { Link } from 'react-router'
import { toast } from 'sonner'

type ToastNotificationProps = {
  className?: string
  children: ReactNode
}

export const ToastNotification = ({ className, children }: ToastNotificationProps) => {
  return (
    <div className={cn('flex items-center text-black gap-4', className)}>
      {children}
    </div>
  )
}

type ToastNotificationMessageProps = {
  type: 'error' | 'success' | 'info' | 'alert'
  children: ReactNode
}
export const ToastNotificationMessage = ({
  type, children }: ToastNotificationMessageProps) => {
  const setIcon = (type: string) => {
    if (type === 'error') return <HiXCircle className='size-5'/>
    if (type === 'success') return <HiCheckCircle className='size-5'/>
    if (type === 'info') return <HiInformationCircle className='size-5'/>
    if (type === 'alert') return <HiExclamation className='size-5'/>
  }
  return (
    <div className='flex gap-2'>
      {setIcon(type)}
      <p className='text-sm'>{children}</p>
    </div>
  )
}

export const ToastNotificationButton = ({ children, to }: {
  children: ReactNode
  to: string
}) => {
  return (
    <Link to={to}>
      <Button
        size='sm'
        variant='outline'
        onClick={() => toast.dismiss()}
        className='text-sm'
      >
        {children}
      </Button>
    </Link>
  )
}
