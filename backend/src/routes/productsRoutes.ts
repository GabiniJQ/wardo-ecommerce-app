import { getProducts, getProductById, getProductsBySearch, getProductsByIds } from '../controllers/productsController.js'
import express from 'express'

const productsRoutes = express.Router()

productsRoutes.get('/', getProducts)
productsRoutes.get('/search', getProductsBySearch)
productsRoutes.get('/:id', getProductById)
productsRoutes.post('/by-ids', getProductsByIds)

export default productsRoutes