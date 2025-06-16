import { useEffect, useState } from 'react'
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
} from '@/pages/home/ProductCard'
import ProductsCarouselSkeleton from '@/pages/home/ProductsCarouselSkeleton'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store'
import { fetchProductsByCategory } from '@/features/products/productsSlice'
import { selectProductByCategory } from '@/features/products/productSelectors'
import { formatCategoryURL } from '@/shared/utils/utils'
import { Link } from 'react-router'

type Props = {
  header: string
  className?: string
  displayed: string
  category: string
}

const ProductsCarousel = ({
  header,
  className,
  displayed,
  category,
}: Props) => {
  const [isButtonShown, setIsButtonShown] = useState<boolean | null>(false)

  // Dispatch functions
  const dispatch = useDispatch<AppDispatch>()

  const { products, isLoading, isError, hasBeenAttempted } = useSelector(
    (state: RootState) => selectProductByCategory(state, category)
  )
  useEffect(() => {
    if (products.length === 0 && !isLoading && !isError && !hasBeenAttempted) {
      dispatch(fetchProductsByCategory(category))
    }
  }, [dispatch, category, products, isLoading, isError, hasBeenAttempted])

  if (isLoading) {
    return (
      <div
        className={clsx(
          'flex bg-white gap-2 rounded-sm overflow-hidden py-[25px] max-h-[420px]',
          displayed === 'full' ? 'w-[100%]' : 'w-[49%]'
        )}
      >
        <ProductsCarouselSkeleton
          className='mx-2 h-[400px]'
          displayed={displayed}
        />
      </div>
    )
  }

  if (isError) {
    return (
      <div
        className={clsx(
          'flex bg-white gap-2 rounded-sm overflow-hidden py-[25px] max-h-[420px]',
          displayed === 'full' ? 'w-[100%]' : 'w-[49%]'
        )}
      >
        <ProductsCarouselSkeleton
          className=' mx-2 h-[420px]'
          displayed={displayed}
        />
      </div>
    )
  }

  return (
    <div
      className={`${
        className ? className : ''
      } flex flex-col bg-white rounded-sm py-4 px-4 h-[420px] shadow-sm shadow-gray-500`}
      onMouseEnter={() =>
        setIsButtonShown((prevButtonShown) => !prevButtonShown)
      } // pause on hover
      onMouseLeave={() =>
        setIsButtonShown((prevButtonShown) => !prevButtonShown)
      }
    >
      <div className='border-l-4 border-primary pl-2'>
        <h1 className='subtitle'>{header}</h1>
      </div>

      <div className='w-full grow'>
        <Carousel opts={{ dragFree: true }}>
          <CarouselContent>
            {products.map((product: Product) => {
              const { category, _id, slug } = product
              const productPath = `${formatCategoryURL(
                category
              )}/${slug}/${_id}`
              return (
                <CarouselItem
                  key={product._id}
                  className='basis-[230px]'
                >
                  <Link to={productPath} >
                    <ProductCard product={product} className='md:py-2'>
                      <ProductCardImage className='bg-gray-100 size-[220px]' />
                      <ProductCardInfo />
                    </ProductCard>
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContent>

          <CarouselNext isButtonShown={isButtonShown} />
          <CarouselPrevious isButtonShown={isButtonShown} />
        </Carousel>
      </div>
    </div>
  )
}

export default ProductsCarousel
