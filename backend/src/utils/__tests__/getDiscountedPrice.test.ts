import getDiscountedPrice from '../getDiscountedPrice'
import { describe, expect, it } from '@jest/globals'

describe('getDiscountedPrice', () => {
  
  describe('when given a price and discount percentage', () => {
    it('should calculates 20% discount correctly', () => {
      const convertedPrice = 100
      const discountPercentage = 20

      const expectedResult = convertedPrice - convertedPrice * (discountPercentage / 100)
      const result = getDiscountedPrice(convertedPrice, discountPercentage)

      expect(result).toBe(expectedResult)
    })
  })

  describe('when given a 0 discount percentage', () => {
    it('should return the same price', () => {
      const convertedPrice = 100
      const discountPercentage = 0

      const result = getDiscountedPrice(convertedPrice, discountPercentage)

      expect(result).toBe(convertedPrice)
    })
  })
})