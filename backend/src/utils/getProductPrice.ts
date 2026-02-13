import { CONVERSION_RATE } from '../consts/conversionRate'
import { Currency } from '../types/currency'

export default function getProductPrice(
  originalPrice: number,
  currency: Currency
) {
  return originalPrice * CONVERSION_RATE[currency]
}
