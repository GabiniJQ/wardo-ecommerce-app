import { AddressOptionContext, useAddressOption } from '@/shared/contexts/addressOptionContext'
import { Address } from '@/shared/types/authTypes'
import { cn } from '@/shared/utils/utils'
import { ReactNode } from 'react'
import { HiHome, HiOfficeBuilding } from 'react-icons/hi'
import { PiLockers } from 'react-icons/pi'

type AddressOptionProps = {
  address: Address
  onSelect?: () => void
  children: ReactNode
  className?: string
}

export const AddressOption = ({
  address, onSelect, children, className
}: AddressOptionProps) => {
  const selectIcon = (addressType: string) => {
    switch (addressType) {
      case 'hogar':
        return <HiHome className='size-6' />
      
      case 'trabajo':
        return <HiOfficeBuilding className='size-6' />
      
      case 'casillero':
        return <PiLockers className='size-6' />

      default:
        return <HiHome className='size-6' />
    }
  }

  return (
    <AddressOptionContext.Provider value={{ address, onSelect, selectIcon }}>
      <div 
        className={cn('flex gap-2 rounded w-full btn hover:bg-accent border-2', className)}
        onClick={onSelect}
      >
        {children}      
      </div>
    </AddressOptionContext.Provider>
  )
}

type AddressOptionIconProps = {
  className?: string
}

export const AddressOptionIcon = ({ className }: AddressOptionIconProps) => {
  const { address, selectIcon } = useAddressOption()
  const addressType = address?.addressType || 'hogar'

  return (
    <div className={cn('flex justify-center items-center border-r-2',
      className
    )}>
      {(selectIcon ?? (() => <HiHome className='size-6' />))(addressType)}
    </div>
  )
}

type AddressOptionInfoProps = {
  className?: string
}

export const AddressOptionInfo = ({ className }: AddressOptionInfoProps) => {
  const { address } = useAddressOption()
  if (!address) return

  const { fullName, city, department, phone } = address
  const { street, number1, number2 } = address.addressInfo

  return (
    <div className={cn('flex flex-col justify-center w-[80%] p-4', className)}>
      <p className='line-clamp-1'>{fullName}</p>
      <p className='line-clamp-1 text-ellipsis'>{`Calle ${street} #${number1}-${number2}`}</p>
      <p className='line-clamp-1'>{city}, {department}</p>
      <p>+57 {phone}</p>
    </div>
  )
}

type AddressOptionActionProps = {
  children: ReactNode
  className?: string
}

export const AddressOptionAction = ({ children, className }: AddressOptionActionProps) => {
  return (
    <div className={cn('flex items-center justify-center h-full border-l-2',
      className
    )}>
      {children}
    </div>
  )
}