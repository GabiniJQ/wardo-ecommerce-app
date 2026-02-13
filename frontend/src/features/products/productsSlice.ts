import {
  FilteredSearchResponse,
  FilteredShowcaseResponse,
  Product,
  ProductByIdResponse,
  ProductsByIdsResponse,
  ProductsState,
} from '@/shared/types/productTypes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '@/lib/axios'
import { AxiosResponse } from 'axios'
import { CartItem } from '@/shared/types/cartTypes'

const initialState: ProductsState = {
  byCategory: {},
  byId: {},
  featured: [],
  brandFeatured: [],
  filteredResults: {
    search: {
      products: [],
      isLoading: false,
      isError: false,
      pagination: {
        total: 1, // total products count
        page: 1,
        pages: 1,
        limit: 10,
      },
      pricesAverage: 0,
      filteredBrands: [],
      allBrands: [],
      filteredRating: 0,
    },
    showcase: {},
  },
}

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ category, limit = 10 }: {
    category: string, limit?: number
  }, { getState, rejectWithValue }) => {
    const state = getState() as { products: ProductsState }
    const categoryData = state.products.byCategory[category]

    if (categoryData.hasBeenAttempted && (categoryData?.isLoading || categoryData?.products.length > 0)) {
      return rejectWithValue('category_already_loaded')
    }

    try {
      const res = await api.get(
        `/products?category=${encodeURIComponent(category)}&limit=${limit.toString()}`
      )
      if (!res.data.products || res.data.products.length === 0) {
        return rejectWithValue('no_products_found')
      }
      return { category, products: res.data.products } as {
        category: string
        products: Product[]
      }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ProductByIdResponse>(`/products/${id}`)
      return { id, product: res.data.product as Product }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchSearchResults = createAsyncThunk(
  'products/fetchSearchResults',
  async (filters: {
    query?: string
    page?: number
    limit?: number
    minPrice?: number
    maxPrice?: number
    minRating?: number
    brands?: string
    sortBy?: string
    sortOrder?: string
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      
      // Add all existing filters
      if (filters.query) params.append('q', filters.query)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
      if (filters.brands && filters.brands.length > 0) params.append('brands', filters.brands)
      if (filters.minRating) params.append('minRating', filters.minRating.toString())
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

      const response: AxiosResponse<FilteredSearchResponse> = await api.get(
        `/products/search?${params.toString()}`
      )

      const products = response.data.searchData.products 
      const pagination = response.data.searchData.pagination 
      const pricesAverage = response.data.searchData.pricesAverage 
      const filteredBrands = response.data.searchData.filteredBrands 
      const allBrands = response.data.searchData.allBrands 
      const filteredRating = response.data.searchData.filteredRating

      return { products, pagination, pricesAverage, filteredBrands, allBrands, filteredRating }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchShowcaseResults = createAsyncThunk(
  'products/fetchShowcaseResults',
  async (filters: {
    limit?: number
    brands?: string
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      
      // Add all existing filters
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.brands && filters.brands.length > 0) params.append('brands', filters.brands)

      const response: AxiosResponse<FilteredShowcaseResponse> = await api.get(
        `/products/search?${params.toString()}`
      )
      const products = response.data.searchData.products 

      return { products }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchCartProducts = createAsyncThunk(
  'products/fetchCartProducts',
  async () => {
    // Get cart from localstorage
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[]
    
    if (cartItems.length === 0) {
      return []
    }
    
    // Extract ID's
    const productIds = cartItems.map((item) => item.productId)
    
    // Fetch products by extacted ID's
    const response: AxiosResponse<ProductsByIdsResponse> = await api.post('/products/by-ids', {
      ids: productIds
    })
    
    return response.data.products
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearFeaturedProducts: (state) => {
      state.featured = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCategory.pending, (state, action) => {
        const category = action.meta.arg.category
        state.byCategory[category] = {
          products: state.byCategory[category]?.products || [],
          isLoading: true,
          isError: false,
          hasBeenAttempted:
            state.byCategory[category]?.hasBeenAttempted || false,
        }
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        const { category, products } = action.payload
        state.byCategory[category] = {
          products,
          isLoading: false,
          isError: false,
          hasBeenAttempted: true,
        }

        products.forEach((product) => {
          state.byId[product._id] = {
            product,
            isLoading: false,
            isError: false,
          }
        })
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        const category = action.meta.arg.category
        const currentCategory = state.byCategory[category] || {}

        state.byCategory[category] = {
          products: currentCategory.products,
          isLoading: false,
          isError: action.payload !== 'category_already_loaded',
          hasBeenAttempted: true,
        }
      })
      .addCase(fetchProductById.pending, (state, action) => {
        const id = action.meta.arg
        state.byId[id] = {
          isLoading: true,
          isError: false,
          product: null,
        }
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        if (action.payload) {
          const { id, product } = action.payload
          state.byId[id] = {
            isLoading: false,
            isError: false,
            product,
          }
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        const id = action.meta.arg
        state.byId[id] = {
          isLoading: false,
          isError: true,
          product: null,
        }
      })
      .addCase(fetchSearchResults.pending, (state) => {
        state.filteredResults.search.products = []
        state.filteredResults.search.isLoading = true
        state.filteredResults.search.isError = false
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        if (action.payload) {
          const {
            products,
            pagination,
            pricesAverage,
            filteredBrands,
            allBrands,
          } = action.payload
          state.filteredResults.search.products = products
          state.filteredResults.search.pagination = pagination
          state.filteredResults.search.pricesAverage = pricesAverage
          state.filteredResults.search.filteredBrands = filteredBrands
          state.filteredResults.search.allBrands = allBrands
          state.filteredResults.search.isLoading = false
          state.filteredResults.search.isError = false
        }
      })
      .addCase(fetchSearchResults.rejected, (state) => {
        state.filteredResults.search.products = []
        state.filteredResults.search.isLoading = false
        state.filteredResults.search.isError = true
      })
      .addCase(fetchShowcaseResults.pending, (state, action) => {
        if (action.meta.arg.brands) {
          const brand = action.meta.arg.brands
          state.filteredResults.showcase[brand] = {
            products: [],
            isLoading: true,
            isError: false,
          }
        }
      })
      .addCase(fetchShowcaseResults.fulfilled, (state, action) => {
        if (action.payload && action.meta.arg.brands) {
          const { products } = action.payload
          const brand = action.meta.arg.brands
          state.filteredResults.showcase[brand] = {
            products,
            isLoading: false,
            isError: false,
          }
        }
      })
      .addCase(fetchShowcaseResults.rejected, (state, action) => {
        if (action.meta.arg.brands) {
          const brand = action.meta.arg.brands
          state.filteredResults.showcase[brand] = {
            products: [],
            isLoading: false,
            isError: true,
          }
        }
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        action.payload.forEach((product) => {
          state.byId[product._id] = {
            product: product,
            isLoading: false,
            isError: false
          }
        })
      })
  },
})

export const { clearFeaturedProducts } = productsSlice.actions
export default productsSlice.reducer
