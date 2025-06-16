import { CATEGORIES } from '@/consts/productCategories'
import ProductsCarousel from '@/pages/home/ProductsCarousel'

const TopCategory = () => {
  return (
    <div className='relative flex justify-between items-center md:-mt-32 mb-4  mx-auto'>
      <ProductsCarousel
        className='w-[49%]'
        header='Computadores portátiles'
        displayed='half'
        category={CATEGORIES.PORTATILES.ORIGINAL}
      />
      <ProductsCarousel
        className='w-[49%]'
        header='Decoración hogareña'
        displayed='half'
        category={CATEGORIES.DECORACION_DE_HOGAR.ORIGINAL}
      />
    </div>
  )
}

export default TopCategory
