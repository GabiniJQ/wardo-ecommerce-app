import { CONVERSION_RATE } from '../consts/conversionRate'
import { Currency } from '../types/currency'

export default function getBasePrice(rangePrice: number, currency: Currency) {
  return Math.round(rangePrice / CONVERSION_RATE[currency])
}
