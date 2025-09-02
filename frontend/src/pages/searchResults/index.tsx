import { AppDispatch, RootState } from '@/app/store'
import { CONVERSION_RATE } from '@/consts/conversionRate'
import { fetchSearchResults } from '@/features/products/productsSlice'
import { formatCategoryText } from '@/shared/utils/utils'
import SearchFilters from '@/pages/searchResults/SearchFilters'
import { Product } from '@/shared/types/productTypes'
import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router'
import { PaginationSection } from '@/shared/components/PaginationSection'
import ProductCardDetailedSkeleton from '@/shared/components/ProductCardDetailedSkeleton'
import ProductCardDetailed from '@/shared/components/ProductCardDetailed'

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
      <>
        <div className='p-4 md:px-40 md:py-10'>
          Cargando productos para: <span className='italic text-primary'>
            {formatCategoryText(query)}
          </span>
        </div>

        <div className='grid px-4 py-10 md:px-40 md:py-20 md:grid-cols-4 md:gap-10'>
          <ProductCardDetailedSkeleton orientation='vertical' className='p-4 h-[500px]'/>
          <ProductCardDetailedSkeleton orientation='vertical' className='p-4 h-[500px]'/>
          <ProductCardDetailedSkeleton orientation='vertical' className='p-4 h-[500px]'/>
          <ProductCardDetailedSkeleton orientation='vertical' className='p-4 h-[500px]'/>
        </div>
      </>
    )
  }

  return (
    <div className='flex flex-col justify-between gap-20 pb-4'>
      <div className='flex flex-col gap-6'>
        {/* Not found */}
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

        <div className='flex flex-col gap-4 p-4 bg-white md:mx-40'>
          {products.length > 0 && (
            <h1 className='text-xl font-semibold line-clamp-1'>Resultados para:{' '}
              <span className=' italic'>{formatCategoryText(query)}</span>
            </h1>
          )}

          {/* Filter trigger */}
          <div className=''>
            <SearchFilters
              onFilterChange={handleFilterChange} 
              initialValues={{
                minPrice: searchParams.get('minPrice') || '0',
                maxPrice: searchParams.get('maxPrice') || `${pricesAverageCOP}`,
              }}
              pricesAverage={pricesAverageCOP}
            />
          </div>

          {/* Searched products */}
          <div className='grid gap-6 lg:grid-cols-3 2xl:grid-cols-4'>
            {products.map((product: Product) => (
              <div key={product._id} className='bg-white rounded'>
                <ProductCardDetailed  product={product}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PaginationSection />
    </div>
  )
}

export default SearchResultsPage