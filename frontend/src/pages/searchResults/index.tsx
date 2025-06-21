import { AppDispatch, RootState } from '@/app/store'
import BuyingOptions from '@/shared/components/BuyingOptions'
import ProductRating from '@/shared/components/ProductRating'
import { CONVERSION_RATE } from '@/consts/conversionRate'
import { fetchSearchResults } from '@/features/products/productsSlice'
import { formatCategoryText, formatCategoryURL } from '@/shared/utils/utils'
import { ProductCard, ProductCardImage, ProductCardInfo } from '@/pages/home/ProductCard'
import SearchFilters from '@/pages/searchResults/SearchFilters'
import { Product } from '@/shared/types/productTypes'
import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { PaginationSection } from '@/shared/components/PaginationSection'
import ProductCardDetailedSkeleton from '@/shared/components/ProductCardDetailedSkeleton'

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') || ''

  const { products, pricesAverage, isLoading, isError } = useSelector(
    (state: RootState) => state.products.filteredResults.search
  )

  // Higher price in searched products conversion
  const pricesAverageCOP = pricesAverage * CONVERSION_RATE.COP

  const dispatch = useDispatch<AppDispatch>()

  const navigate = useNavigate()

  // Memoize params
  const currentParams = useMemo(() => {
    return Object.fromEntries(searchParams.entries())
  }, [searchParams])

  // Update filters function (Sets page 1 default)
  const handleFilterChange = useCallback((newFilters: Record<string, string>) => {
    setSearchParams(prev => {
      const updated = new URLSearchParams(prev)
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          updated.set(key, value)
        } else {
          updated.delete(key)
        }
      })
      updated.set('page', '1') // Reset page to 1
      return updated
    }, { replace: true }) 
  }, [setSearchParams])

  useEffect(() => {
    if (currentParams.q === '') {
      navigate('/')
      return
    }

    const filters = {
      query: currentParams.q || '',
      page: Number(currentParams.page) || 1,
      limit: Number(currentParams.limit) || 10,
      minPrice: currentParams.minPrice ? Number(currentParams.minPrice) : undefined,
      maxPrice: currentParams.maxPrice ? Number(currentParams.maxPrice) : undefined,
      brands: currentParams.brands,
      minRating: Number(currentParams.minRating) || 0,
    }

    dispatch(fetchSearchResults(filters))
  }, [currentParams, dispatch, navigate])

  if (isLoading || isError) {
    return (
      <ProductCardDetailedSkeleton />
    )
  }

  return (
    <div className='flex flex-col justify-between gap-10 min-h-screen pb-4'>
      <div className='flex flex-col'>
        {/* Filter trigger */}
        <div className='flex justify-center items-center bg-white shadow z-50'>
          <SearchFilters
            onFilterChange={handleFilterChange} 
            initialValues={{
              minPrice: searchParams.get('minPrice') || '0',
              maxPrice: searchParams.get('maxPrice') || `${pricesAverageCOP}`,
            }}
            pricesAverage={pricesAverageCOP}
          />
        </div>

        {/* Filters container */}
        {products.length === 0 && (
          <div className='flex flex-col gap-4 p-4 bg-white md:mx-40 min-h-[550px]'>
            <h1 className='title text-primary my-4'>No encontramos lo que estás buscando :(</h1>

            <p>
              Prueba con otra búsqueda diferente a <em className='text-primary'>{query}</em>
              {' '}o intenta con otros filtros. También puedes explorar nuestros productos
              {' '}en el <a href='/' className='link text-primary'>inicio.</a>
            </p>
            
          </div>
        )}

        <div className='md:mx-40 bg-white'>
          {products.length > 0 && (
            <h1 className='m-4 text-xl font-semibold line-clamp-1'>Resultados para:{' '}
              <span className=' italic'>{formatCategoryText(query)}</span>
            </h1>
          )}

          {/* Searched products */}
          <div className='grid gap-6 px-2 lg:grid-cols-3 2xl:grid-cols-4'>
            {products.map((product: Product) => {
              const {
                rating,
                reviews,
                description,
                shippingInformation,
                _id,
                stock,
                category,
                slug,
              } = product

              const productLink = `/${formatCategoryURL(category)}/${slug}/${_id}`
              return (
                <ProductCard
                  key={_id}
                  product={product}
                  className='flex-row p-2 size-full shadow rounded lg:flex-col'
                >
                  <Link to={productLink} className='flex justify-center items-center bg-gray-100 w-1/2 lg:w-full'>
                    <ProductCardImage/>
                  </Link>
                  
                  <div className='flex flex-col justify-between gap-4 px-2 w-1/2 lg:w-full'>
                    {/* Rating stars */}
                    <Link to={productLink} className='flex flex-col justify-between gap-4'>
                      <div className='flex gap-2'>
                        <p className='text-sm'>{rating}</p>
                        <ProductRating rating={rating}/>
                        <p className='text-sm'>({reviews.length})</p>
                      </div>

                      <ProductCardInfo className='text-xl'/>

                      {/* Description */}
                      <p className='text-sm text-gray-700 line-clamp-4'>{description}</p>

                      <div className='flex flex-col gap-1'>
                        <h4 className='font-semibold text-sm'>Envío a nivel nacional</h4>
                        <p className='text-xs'>{shippingInformation}</p>
                      </div>
                    </Link>

                    <BuyingOptions productId={_id} quantity={1} stock={stock} />
                  </div>
                </ProductCard>
              )
            })}
          </div>
        </div>
      </div>

      <PaginationSection />
    </div>
  )
}

export default SearchResultsPage