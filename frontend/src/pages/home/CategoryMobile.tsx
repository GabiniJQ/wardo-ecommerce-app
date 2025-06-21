import { useEffect } from 'react'
import {
  ProductCard,
  ProductCardImage,
  ProductCardInfo,
  ProductCardOffTag,
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
      dispatch(fetchProductsByCategory({category}))
    }
    
  }, [dispatch, category, products, isLoading, isError, hasBeenAttempted])

  if (isLoading || isError) {
    return (
      <div className='grid grid-cols-2 gap-2 bg-white p-4 w-full h-[800px] rounded shadow'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div className='size-full' key={i}>
            <Skeleton className='h-2/3' />
            <div className='flex flex-col gap-2 h-1/3 py-2'>
              <Skeleton className='size-full' />
              <Skeleton className='size-full' />
              <Skeleton className='size-full' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='relative flex flex-col justify-between min-w-[240px] mb-4 pb-10 mx-auto rounded-lg bg-white shadow-gray-500 shadow-sm'>
      <div className='p-2 border-b-xs-gray border-dashed '>
        <h2 className='subtitle text-center'>{header}</h2>
      </div>

      <div className='grid grid-cols-2'>
        {products.map((product: Product, i) => {
          const { category, _id, slug } = product
          const productPath = `${formatCategoryURL(category)}/${slug}/${_id}`
          
          if (products.length % 2 === 1 && i === products.length - 1) return
          return (
            <div className='flex items-center even:border-l-[1px] size-full border-gray-300 border-dashed odd:last:border-r-[1px] bg-white' 
              key={product._id}
            >
              <Link to={productPath} className='size-full '>
                <ProductCard product={product} className='p-4 border-b-xs-gray border-dashed text-sm size-full'>
                  <ProductCardImage className='size-full'/>
                  <ProductCardInfo className=''/>
                  <ProductCardOffTag className='absolute top-4 right-4'/>
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
