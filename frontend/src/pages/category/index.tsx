import { AppDispatch, RootState } from '@/app/store'
import { CATEGORIES } from '@/consts/productCategories'
import { fetchProductsByCategory } from '@/features/products/productsSlice'
import ProductCardDetailed from '@/shared/components/ProductCardDetailed'
import ProductCardDetailedSkeleton from '@/shared/components/ProductCardDetailedSkeleton'
import useScreenSize from '@/shared/hooks/useScreenSize'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'

const CategoryPage = () => {
  const { category } = useParams()
  const categoriesArray = Object.values(CATEGORIES)
  const originalCategories = categoriesArray.map((cat) => cat.ORIGINAL)

  const productBackUp = {
    products: [],
    isLoading: false,
    isError: false,
    hasBeenAttempted: false,
  }
    
  const { products } = useSelector((state: RootState) => 
    state.products.byCategory[category ?? ''] ?? productBackUp
  )
  const dispatch = useDispatch<AppDispatch>()

  const navigate = useNavigate()

  const isMobile = useScreenSize()
  
  useEffect(() => {
    if (!category || !originalCategories.includes(category)){
      navigate('/')
    }
  }, [category, originalCategories, navigate])

  useEffect(() => {
    if (products.length === 0 && category) {
      dispatch(fetchProductsByCategory({ category }))
    }
  }, [products, dispatch, category])

  if (!category) return

  const currentCategory = categoriesArray.map((catObj) =>
    catObj.ORIGINAL === category ? catObj.FORMATED : ''
  )

  return (
    <div className='flex flex-col gap-6 p-4 md:p-10 2xl:mx-40 bg-white'>
      <h1 className='text-primary title text-center md:text-left'>{currentCategory}</h1>

      <div className='grid gap-6 px-2 lg:grid-cols-3 2xl:grid-cols-4'>
        {products.map((product) => {
          return (
            <div key={product._id} className='bg-white shadow rounded'>
              <ProductCardDetailed  product={product}/>
            </div>
          )
        })}
      </div>

      {/* Skeleton */}
      {isMobile && products.length === 0 && (
        <ProductCardDetailedSkeleton />
      )}

      {!isMobile && products.length === 0 && (
        <div className='grid grid-cols-2 gap-6 size-full'>
          {Array.from({ length: 2 }).map((_,i) => (
            <ProductCardDetailedSkeleton key={i}/>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryPage
