import { CONVERSION_RATE } from '../consts/conversionRate'
import { Currency } from '../types/currency'

export default function getBasePrice(rangePrice: number, currency: Currency) {
  return Number((rangePrice / CONVERSION_RATE[currency]).toFixed(2))
}
