export type Product = {
  _id: string
  title: string
  description: string
  price: number
  discountPercentage: number
  stock: number
  category: string
  images: string[]
  brand: string
  rating: number
  reviews:  Review[]
  shippingInformation: string
  slug: string
}

export type Review = {
  rating: number
  comment: string
  reviewerName: string
  reviewerEmail: string
  date: Date
}

export interface ProductsState {
  byCategory: {
    [category: string]: {
      products: Product[]
      isLoading: boolean
      isError: boolean
      hasBeenAttempted: boolean
    }
  }
  byId: {
    [id: string]: {
      product: Product | null
      isLoading: boolean
      isError: boolean
    }
  }
  featured: Product[]
  brandFeatured: Product[]
  filteredResults: {
    search: {
      products: Product[]
      isLoading: boolean
      isError: boolean
      pagination: {
        total: number
        page: number
        pages: number
        limit: number
      }
      pricesAverage: number
      filteredBrands: string[]
      allBrands: string[]
      filteredRating: number
    },
    showcase: {
      [brand: string]: {
        products: Product[]
        isLoading: boolean
        isError: boolean
      }
    },
  },
}

export interface ProductByIdResponse {
  message: string
  product: Product
}

export interface ProductsByCategory {
  message: string
  product: Product[]
}

export interface FilteredSearchResponse {
  message: string
  searchData: {
    products: Product[]
    pagination: {
      total: number
      page: number
      pages: number
      limit: number
    }
    pricesAverage: number
    filteredBrands: string[]
    allBrands: string[]
    filteredRating: number
  }
}

export interface FilteredShowcaseResponse {
  message: string
  searchData: {
    products: Product[]
  }
}