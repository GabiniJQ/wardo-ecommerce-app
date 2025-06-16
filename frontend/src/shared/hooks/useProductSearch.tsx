import { AppDispatch } from '@/app/store'
import { fetchSearchResults } from '@/features/products/productsSlice'
/* import { useEffect } from 'react' */
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router'

export const useProductSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()

  // Obtener todos los parámetros actuales
  const getCurrentParams = () => {
    return {
      q: searchParams.get('q') || '',
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      rating: searchParams.get('rating'),
      brands: searchParams.get('brands'),
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    }
  }

  // Update multiple params
  const updateSearchParams = (newParams: Record<string, string>) => {
    const current = getCurrentParams()
    // Remove keys with null or undefined values
    const filteredParams: Record<string, string> = {}
    Object.entries({ ...current, ...newParams, page: '1' }).forEach(
      ([key, value]) => {
        if (value !== null && value !== undefined) {
          filteredParams[key] = value
        }
      }
    )
    setSearchParams(filteredParams)
  }

  // Función de búsqueda
  const searchProducts = async () => {
    try {
      const params = getCurrentParams()
      const queryString = new URLSearchParams()

      // Agregar todos los parámetros válidos
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryString.append(key, value)
      })

      dispatch(fetchSearchResults(queryString))
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  // Efecto para búsqueda automática cuando cambian los parámetros
/*   useEffect(() => {
    searchProducts()
  }, [searchParams])
 */
  return {
    filters: getCurrentParams(),
    updateSearchParams,
    searchProducts,
  }
}
