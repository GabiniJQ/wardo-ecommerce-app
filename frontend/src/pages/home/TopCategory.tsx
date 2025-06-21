import { CATEGORIES } from '@/consts/productCategories'
import ProductsCarousel from '@/pages/home/ProductsCarousel'

const TopCategory = () => {
  return (
    <div className='relative grid grid-cols-2 gap-8'>
      <ProductsCarousel
        className='w-full'
        header='Relacionado con tus búsquedas...'
        category={CATEGORIES.PORTATILES.ORIGINAL}
        basis='lg:basis-1/2'
      />
      <ProductsCarousel
        className='w-full'
        header='Productos en tendencia'
        basis='lg:basis-1/2'
        category={CATEGORIES.DECORACION_DE_HOGAR.ORIGINAL}
      />
    </div>
  )
}

export default TopCategory
