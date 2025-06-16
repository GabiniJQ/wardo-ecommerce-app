import { ErrorResponse } from '../middlewares/errorMiddleware'
import Product from '../models/productModel'
import { PaginatedSearchResult, ProductDb, SearchFilters, SearchQueryParams } from '../types/productTypes'
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const category = req.query.category
  const limit = Number(req.query.limit)

  // Get Products by category
  if (!category) {
    res.status(404)
    throw new Error('Categoría requerida en query')
  } else {
    const productsByCategory = await Product
      .find({ category: new RegExp(`^${category}$`, 'i') })
      .limit(limit)

    if (productsByCategory.length === 0) {
      res.status(400)
      throw new Error(`No se encontró la categoría "${category}"`)
    }
      

    res.status(200).json({
      message: 'Productos cargados exitosamente',
      products: productsByCategory
    })
  }
})

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const product = await Product.findById(id)

  if (!product) {
    res.status(404)
    throw new Error('Producto no encontrado - BE')
  }

  res.status(200).json({ message: 'Producto encontrado', product})
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

  const filters: SearchFilters = {}

  if (q) {
    filters.$text = { $search: q }
  }

  if (minPrice || maxPrice) {
    filters.price = {}
    if (minPrice) filters.price.$gte = Number(minPrice)
    if (maxPrice) filters.price.$lte = Number(maxPrice)
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
        Product.find(filters, null, options),
        Product.countDocuments(filters)
      ])
      
      res.json({
        message: 'Productos filtrados correctamente',
        searchData: {
          products,
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
      const products = await Product.find(filters, null, options)

      res.json({
        message: 'Productos filtrados correctamente',
        searchData: {
          products
        }
      })
    }
  } catch (error) {
    res.status(400)
    throw new Error('Error interno')
  }
})