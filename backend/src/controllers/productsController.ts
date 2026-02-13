import { CONVERSION_RATE } from '../consts/conversionRate.js'
import { ErrorResponse } from '../middlewares/errorMiddleware.js'
import Product from '../models/productModel.js'
import { PaginatedSearchResult, ProductDb, SearchFilters, SearchQueryParams } from '../types/productTypes.js'
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import getProductPrice from '../utils/getProductPrice.js'
import getDiscountedPrice from '../utils/getDiscountedPrice.js'
import getBasePrice from '../utils/getBasePrice.js'

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const category = req.query.category
  const limit = Number(req.query.limit)
  const currency = 'COP' // Placeholder for future multiple currencies

  // Get Products by category
  if (!category) {
    res.status(404)
    throw new Error('Categoría requerida en query')
  } else {
    const productsByCategory = await Product
      .find({ category: new RegExp(`^${category}$`, 'i') })
      .limit(limit)
      .lean()

    if (productsByCategory.length === 0) {
      res.status(400)
      throw new Error(`No se encontró la categoría "${category}"`)
    }

    // Adding prices with discount applied and currency conversion
    const productsPriceConversion = productsByCategory.map((product) => {
      const convertedPrice = getProductPrice(product.price, currency)
      return {
        ...product,
        price: convertedPrice,
        discountedPrice: getDiscountedPrice(convertedPrice, product.discountPercentage)
      }
    })

    res.status(200).json({
      message: 'Productos cargados exitosamente',
      products: productsPriceConversion
    })
  }
})

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const currency = 'COP' // Placeholder for future multiple currencies

  const product = await Product.findById(id).lean()

  
  if (!product) {
    res.status(404)
    throw new Error('Producto no encontrado - BE')
  }
  
  // Adding prices with discount applied and currency conversion
  const convertedPrice = getProductPrice(product.price, currency)
  const productPriceConversion = {
    ...product,
    price: convertedPrice,
    discountedPrice: getDiscountedPrice(convertedPrice, product.discountPercentage)
  }
  
  res.status(200).json({
    message: 'Producto encontrado', product: productPriceConversion
  })
})


// Get multiple products by their Ids
export const getProductsByIds = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.body
  const currency = 'COP'
  
  if (!ids || !Array.isArray(ids)) {
    res.status(400)
    throw new Error('IDs requeridos')
  }
  
  const products = await Product.find({ _id: { $in: ids } }).lean()
  console.log(products)
  
  // Price conversion
  const productsWithConversion = products.map((product) => {
    const convertedPrice = getProductPrice(product.price, currency)
    return {
      ...product,
      price: convertedPrice,
      discountedPrice: getDiscountedPrice(convertedPrice, product.discountPercentage)
    }
  })
  
  res.status(200).json({
    message: 'Productos cargados',
    products: productsWithConversion
  })
})

export const getProductsBySearch = asyncHandler(async (
  req: Request<{}, {}, {}, SearchQueryParams>,
  res: Response<PaginatedSearchResult<ProductDb> | ErrorResponse>
) => {
  const {
    q,
    page = '1',
    limit = '10',
    minPrice = '0',
    maxPrice,
    minRating,
    brands,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query

  const currency = 'COP' // Placeholder for future currency param

  const filters: SearchFilters = {}

  if (q) {
    filters.$text = { $search: q }
  }

  if (minPrice || maxPrice) {
    filters.price = {}
    if (minPrice) filters.price.$gte = getBasePrice(Number(minPrice), currency)
    if (maxPrice) filters.price.$lte = getBasePrice(Number(maxPrice), currency)
  }

  if (minRating) {
    filters.rating = { $gte: Number(minRating) }
  }

  if (brands) {
    filters.brand = { $in: brands.split(',') }
  }

  const options = {
    skip: (Number(page) - 1) * Number(limit),
    limit: Number(limit),
    sort: { [sortBy as string]: sortOrder === 'desc' ? -1 : 1 }
  }

  try {
    if (q) {
      // Check maxPrice is set to average and above filter
      const productsPriceOnly = await Product.find(
        { $text: { $search: q } }
      ).select('price')

      let priceSum = 0
      for (const { price } of productsPriceOnly) {
        priceSum += price
      }
      const pricesAverage = parseInt((priceSum / productsPriceOnly.length).toFixed(0))

      if (filters.price && maxPrice && Number(maxPrice) === pricesAverage) {
        delete filters.price.$lte
      }

      // Get all available brands for text query
      const allBrandsArray = await Product.find(
        { $text: { $search: q }}
      ).select('brand')

      const allBrands: string[] = []
      allBrandsArray.map((brandObj) => {
        if (!allBrands.includes(brandObj.brand)) {
          allBrands.push(brandObj.brand)
        }
      })

      // All filters applied query with document count for pagination
      const [products, total] = await Promise.all([
        Product.find(filters, null, options).lean(),
        Product.countDocuments(filters)
      ])

      // Adding prices with discount applied and currency conversion
      const productsPriceConversion = products.map((product) => {
        const convertedPrice = getProductPrice(product.price, currency)
        return {
          ...product,
          price: convertedPrice,
          discountedPrice: getDiscountedPrice(convertedPrice, product.discountPercentage)
        }
      })
      
      res.json({
        message: 'Productos filtrados correctamente',
        searchData: {
          products: productsPriceConversion,
          pagination: {
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            limit: Number(limit)
          },
          pricesAverage,
          filteredBrands: brands?.split(',') || [],
          allBrands,
          filteredRating: Number(minRating) || 0,
        }
      })
    } else {
      const products = await Product.find(filters, null, options).lean()

      // Adding prices with discount applied and currency conversion
      const productsPriceConversion = products.map((product) => {
        const convertedPrice = getProductPrice(product.price, currency)
        return {
          ...product,
          price: convertedPrice,
          discountedPrice: getDiscountedPrice(convertedPrice, product.discountPercentage)
        }
      })

      res.json({
        message: 'Productos filtrados correctamente',
        searchData: {
          products: productsPriceConversion,
        }
      })
    }
  } catch (error) {
    res.status(400)
    throw new Error('Error interno')
  }
})