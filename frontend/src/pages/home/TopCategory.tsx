import { CATEGORIES } from '@/consts/productCategories'
import ProductsCarousel from '@/pages/home/ProductsCarousel'

const TopCategory = () => {
  return (
    <div className='relative'>
      <ProductsCarousel
        className='w-full rounded-xl'
        header='Relacionado con tus búsquedas...'
        category={CATEGORIES.PORTATILES.ORIGINAL}
        basis='sm:basis-1/3 lg:basis-1/5'
      />
    </div>
  )
}

export default TopCategory
