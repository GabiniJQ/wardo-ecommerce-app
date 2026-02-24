import { describe, expect, it } from '@jest/globals'
import { Currency } from '../../types/currency'
import getBasePrice from '../getBasePrice'
import { CONVERSION_RATE } from '../../consts/conversionRate'

describe('getBasePrice', () => {
  // Test 1: USD conversion (should return same value since USD is base)
  describe('when currency is USD', () => {
    it('should return the same price since USD is the base currency', () => {
      const rangePrice = 100
      const currency: Currency = 'USD'
      
      const result = getBasePrice(rangePrice, currency)
      
      expect(result).toBe(100)
    })
  })

  // Test 2: EUR conversion
  describe('when currency is EUR', () => {
    it('should convert EUR to USD correctly', () => {
      const rangePrice = 100
      const currency: Currency = 'EUR'

      const expectedResult = Number((100 / CONVERSION_RATE.EUR).toFixed(2))
      
      const result = getBasePrice(rangePrice, currency)
      
      expect(result).toBe(expectedResult)
    })

    it('should round to 2 decimal places', () => {
      const rangePrice = 99.999
      const currency: Currency = 'EUR'
      
      const result = getBasePrice(rangePrice, currency)
      
      // Check that result has at most 2 decimal places
      expect(result.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2)
    })
  })

  // Test 3: COP conversion
  describe('when currency is COP', () => {
    it('should convert COP to USD correctly', () => {
      const rangePrice = 4000000
      const currency: Currency = 'COP'
      const expectedResult = Number((4000000 / CONVERSION_RATE.COP).toFixed(2))
      
      const result = getBasePrice(rangePrice, currency)
      
      expect(result).toBe(expectedResult)
    })
  })

  // Test 4: Edge cases
  describe('edge cases', () => {
    it('should handle zero price', () => {
      const rangePrice = 0
      const currency: Currency = 'USD'
      
      const result = getBasePrice(rangePrice, currency)
      
      expect(result).toBe(0)
    })

    it('should handle very small prices', () => {
      const rangePrice = 0.01
      const currency: Currency = 'USD'
      
      const result = getBasePrice(rangePrice, currency)
      
      expect(result).toBe(0.01)
    })

    it('should handle very large prices', () => {
      const rangePrice = 999999999
      const currency: Currency = 'COP'
      
      const result = getBasePrice(rangePrice, currency)
      
      expect(result).toBeGreaterThan(0)
      expect(typeof result).toBe('number')
    })

    it('should always return a number type', () => {
      const rangePrice = 100
      const currency: Currency = 'EUR'
      
      const result = getBasePrice(rangePrice, currency)
      
      expect(typeof result).toBe('number')
    })
  })
})