import { Types, Document } from 'mongoose'

export type ProductDb = {
  _id: Types.ObjectId
  title: string
  description: string
  price: number
  discountPercentage: number
  stock: number
  category: string
  images: string[]
  brand: string
  rating: number
  reviews: {
    rating: number
    comment: string
    reviewerName: string
    reviewerEmail: string
    date: Date
  }
  shippingInformation: string
  slug: string
}

export type ProductResponse = {
  _id: Types.ObjectId
  title: string
  description: string
  price: number
  discountPercentage: number
  stock: number
  category: string
  images: string[]
  brand: string
  rating: number
  reviews: {
    rating: number
    comment: string
    reviewerName: string
    reviewerEmail: string
    date: Date
  }
  shippingInformation: string
  slug: string
}

export interface ProductDocument extends Document {
  _id: Types.ObjectId
  title: string
  description: string
  price: number
  discountPercentage: number
  stock: number
  category: string
  images: string[]
  brand: string
  rating: number
  reviews: {
    rating: number
    comment: string
    reviewerName: string
    reviewerEmail: string
    date: Date
  }
  shippingInformation: string
  slug: string
}

export interface PaginatedSearchResult<T> {
  message: string
  searchData: {
    products: T[]
    pagination?: {
      total: number
      page: number
      pages: number
      limit: number
    }
    pricesAverage?: number
    filteredBrands?: string[]
    allBrands?: string[]
    filteredRating?: number
  }
}

export interface SearchQueryParams {
  q: string
  page?: string
  limit?: string
  minPrice?: string
  maxPrice?: string
  minRating?: string
  brands?: string
  sortBy?: 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface SearchFilters {
  $text?: { $search: string }
  price?: {
    $gte?: number
    $lte?: number
  }
  rating?: {
    $gte: number
  }
  brand?: {
    $in: string[]
  }
  sortBy?: 'price' | 'rating' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}
