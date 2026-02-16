import { CONVERSION_RATE } from '../consts/conversionRate.js'
import { Currency } from '../types/currency.js'

export default function getProductPrice(
  originalPrice: number,
  currency: Currency
) {
  return originalPrice * CONVERSION_RATE[currency]
}
