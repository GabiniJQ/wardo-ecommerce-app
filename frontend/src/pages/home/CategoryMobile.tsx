import { useEffect } from 'react'
import {
  ProductCard,
  ProductCardImage,
  ProductCardInfo,
} from '@/pages/home/ProductCard'
import { Product } from '@/shared/types/productTypes'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store'
import { fetchProductsByCategory } from '@/features/products/productsSlice'
import { selectProductByCategory } from '@/features/products/productSelectors'
import { Link } from 'react-router'
import { formatCategoryURL } from '@/shared/utils/utils'

const CategoryMobile = ({ header, category }: { header: string, category: string }) => {
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
      <div>
        <Skeleton className='w-full h-[600px]' />
      </div>
    )
  }

  if (isError) {
    return (
      <div>
        <Skeleton className='w-full h-[600px]' />
      </div>
    )
  }

  return (
    <div className='relative flex flex-col justify-between min-w-[240px] mb-4  mx-auto rounded-lg bg-white  shadow-sm shadow-gray-500'>
      <div className='p-2 border-b-xs-gray border-dashed'>
        <h2 className='text-blue-dark '>{header}</h2>
      </div>

      <div className='grid grid-cols-2 bg-white'>
        {products.map((product: Product) => {
          const { category, _id, slug } = product
          const productPath = `${formatCategoryURL(category)}/${slug}/${_id}`
          return (
            <div className='flex items-center even:border-l-[1px]  border-gray-300 border-dashed odd:last:border-r-[1px]' 
              key={product._id}
            >
              <Link to={productPath} className='size-full'>
                <ProductCard product={product} className='p-4 border-b-xs-gray border-dashed text-sm'>
                  <ProductCardImage className='size-full'/>
                  <ProductCardInfo />
                </ProductCard>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryMobile
