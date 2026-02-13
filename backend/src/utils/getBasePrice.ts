import { CONVERSION_RATE } from '../consts/conversionRate'
import { Currency } from '../types/currency'

export default function getBasePrice(rangePrice: number, currency: Currency) {
  console.log('converted to base:',Math.round(rangePrice / CONVERSION_RATE[currency]))
  return Math.round(rangePrice / CONVERSION_RATE[currency])
}
