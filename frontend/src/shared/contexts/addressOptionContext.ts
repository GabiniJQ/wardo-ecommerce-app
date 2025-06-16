import { Address } from '@/shared/types/authTypes'
import { createContext, ReactElement, useContext } from 'react'

type AddressOptionContextType = {
  address?: Address
  isSelected?: boolean
  onSelect?: () => void
  selectIcon?: (addressType: string) => ReactElement
}

export const AddressOptionContext = createContext<AddressOptionContextType>({})
export const useAddressOption = () => useContext(AddressOptionContext)