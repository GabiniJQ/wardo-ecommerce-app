import { Address } from '@/shared/types/authTypes'

export default function formatAdressLine(address: Address) {
  const { city, department, phone } = address
  const { street, number1, number2 } = address.addressInfo
  
  return `Calle ${street} #${number1}-${number2}, ${city}, ${department}, +57 ${phone}`
}
