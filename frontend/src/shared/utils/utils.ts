import { CATEGORIES } from '@/consts/productCategories'
import { User } from '@/shared/types/authTypes'
import { AxiosError } from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUserLocalStorage(user: User) {
  return {
    name: user.name,
    email: user.email,
    addresses: user.addresses,
  }
}

export function formatCategoryURL(category: string): string {
  return category
    .normalize('NFD')                    
    .replace(/[\u0300-\u036f]/g, '')     // Replace áéíúó
    .toLowerCase()                       
    .replace(/\s+/g, '-')                // Replace spaces with '-'
    .replace(/[^\w-]+/g, '')             // Replace special characters but '-'
    .replace(/--+/g, '-')                // Replace multiple '-'
    .replace(/^-+|-+$/g, '')             // Delete '-' at beginning/end 
}

export const formattedPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price)
}

type CategorySlug = typeof CATEGORIES[keyof typeof CATEGORIES]['ORIGINAL'];

// Map slugs to predefined formats
const PREDEFINED_FORMATS: Record<CategorySlug, string> = Object.values(
  CATEGORIES
).reduce(
  (acc, { ORIGINAL, FORMATED }) => {
    acc[ORIGINAL] = FORMATED
    return acc
  },
  {} as Record<CategorySlug, string>
)

export function formatCategoryText(categorySlug: string): string {
  // Look for category in predefined
  if (categorySlug in PREDEFINED_FORMATS) {
    return PREDEFINED_FORMATS[categorySlug as CategorySlug]
  }
  
  // Fallback formatting
  return categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Get error type and message
export function getErrorMessage(error: unknown) {
  let message = 'Algo no salió como esperabamos...'
  
  if (error instanceof AxiosError) {
    message = error.response?.data.message || error.message
  } else if (error instanceof Error) {
    message = error.message
  }
  
  return message
}

// Calculate checkout prices
export function getCheckoutPrices() {
  
}