import { cn } from '@/shared/utils/utils'
import { ReactNode } from 'react'
import { Link } from 'react-router'

type AccountSettingProps = {
  children: ReactNode
  className?: string
  path: string
}

export const AccountSetting = ({ children, className, path }: AccountSettingProps) => {
  return (
    <Link to={path}>
      <div
        className={cn('flex min-h-[100px] p-2 border-2 border-primary rounded bg-white hover:bg-accent btn',
        className)}
      >
        {children}
      </div>
    </Link>
    
  )
}

type AccountSettingIconProps = {
  children: ReactNode
  className?: string
}

export const AccountSettingIcon = ({ children, className }: AccountSettingIconProps ) => {
  return (
    <div className={cn('flex justify-center items-center w-1/5', className)}>
      {children}
    </div>
  )
}

type AccountSettingDescriptionProps = {
  title: string
  description: string
  className?: string
}

export const AccountSettingDescription = (
  { title, description, className }: AccountSettingDescriptionProps
) => {
  return (
    <div className={cn('flex flex-col justify-center gap-1 w-4/5 text-sm md:text-base'
      , className
    )}>
      <h2 className='text-lg font-semibold'>{title}</h2>

      <p className='text-gray-500'>{description}</p>
    </div>
  )
}

