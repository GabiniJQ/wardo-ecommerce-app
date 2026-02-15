import express from 'express'
import { getOrderByPaymentIntent } from '../controllers/orderController.js'

const orderRoutes = express.Router()

orderRoutes.get('/by-payment-intent/:paymentIntentId', getOrderByPaymentIntent)


export default orderRoutes