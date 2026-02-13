export default function getDiscountedPrice(
  convertedPrice: number,
  discountPercentage: number,
) {
  return convertedPrice - convertedPrice * (discountPercentage / 100)
}
