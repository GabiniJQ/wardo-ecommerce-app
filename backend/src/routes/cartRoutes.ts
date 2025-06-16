import {
  getCartById,
  removeItemCartById,
  addItemById,
  updateItemById
} from '../controllers/cartController.js'
import express from 'express'

const cartRoutes = express.Router()

cartRoutes.get('/:userId', getCartById)
cartRoutes.post('/:userId', addItemById)
cartRoutes.delete('/:userId/:productId', removeItemCartById)
cartRoutes.put('/:userId', updateItemById)

export default cartRoutes