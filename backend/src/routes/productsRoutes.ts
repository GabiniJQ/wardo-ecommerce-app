import { getProducts, getProductById, getProductsBySearch } from '../controllers/productsController'
import express from 'express'

const productsRoutes = express.Router()

productsRoutes.get('/', getProducts)
productsRoutes.get('/search', getProductsBySearch)
productsRoutes.get('/:id', getProductById)

export default productsRoutes