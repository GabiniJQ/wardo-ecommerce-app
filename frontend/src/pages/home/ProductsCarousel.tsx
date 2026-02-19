import { useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/components/ui/carousel'
import { Product } from '@/shared/types/productTypes'
import clsx from 'clsx'
import {
  ProductCard,
  ProductCardImage,
  ProductCardInfo,
  ProductCardOffTag,
} from '@/pages/home/ProductCard'
import ProductsCarouselSkeleton from '@/pages/home/ProductsCarouselSkeleton'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store'
import { fetchProductsByCategory } from '@/features/products/productsSlice'
import { selectProductByCategory } from '@/features/products/productSelectors'
import { formatCategoryURL } from '@/shared/utils/utils'
import { Link } from 'react-router'
import { cn } from '@/shared/utils/utils'

type Props = {
  header: string
  className?: string
  category: string
  basis?: string
  limit?: number
}

const ProductsCarousel = ({
  header,
  className,
  category,
  basis,
  limit = 10,
}: Props) => {

  // Dispatch functions
  const dispatch = useDispatch<AppDispatch>()

  const { products, isLoading, isError, hasBeenAttempted } = useSelector(
    (state: RootState) => selectProductByCategory(state, category)
  )
  useEffect(() => {
    if (products.length === 0 && !isLoading && !isError && !hasBeenAttempted) {
      dispatch(fetchProductsByCategory({ category, limit}))
    }
  }, [dispatch, category, products, isLoading, isError, hasBeenAttempted, limit])

  if (isLoading || isError) {
    return (
      <div
        className={clsx(
          'flex bg-white gap-2 rounded-sm overflow-hidden py-[25px] min-h-[500px]',
          className
        )}
      >
        <ProductsCarouselSkeleton
          className=' mx-2 h-[420px]'
        />
      </div>
    )
  }

  return (
    <div
      className={cn('flex flex-col gap-6'
        , className)}
    >
      <div className='line-clamp-1'>
        <h1 className='text-2xl font-medium xl:text-3xl'>{header}</h1>
      </div>

      <Carousel
        opts={{ dragFree: true }}
        className='w-full h-full'
      >
        <CarouselContent className=''>
          {products.map((product: Product) => {
            const { category, _id, slug } = product
            const productPath = `${formatCategoryURL(category)}/${slug}/${_id}`
            return (
              <CarouselItem
                key={product._id}
                className={cn('pl-4 last:pr-4 ', basis)}
              >
                <Link
                  to={productPath}
                  className='size-full p-4 block border bg-white rounded-xl hover:shadow-lg hover:shadow-black/10 z-50 transition'
                >
                  <ProductCard
                    product={product}
                    className=''
                  >
                    <ProductCardImage className='size-full' />
                    <ProductCardInfo className='xl:min-h-[100px]' />

                    <ProductCardOffTag className='absolute left-[5%] top-[5%]' />
                  </ProductCard>
                </Link>
              </CarouselItem>
            )
          })}
        </CarouselContent>

        <CarouselNext isButtonShown className=' text-primary z-50'/>
        <CarouselPrevious isButtonShown className='- text-primary z-50'/>
      </Carousel>
    </div>
  )
}

export default ProductsCarousel
