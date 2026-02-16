import { CONVERSION_RATE } from '../consts/conversionRate.js'
import { Currency } from '../types/currency.js'

export default function getBasePrice(rangePrice: number, currency: Currency) {
  return Number((rangePrice / CONVERSION_RATE[currency]).toFixed(2))
}
