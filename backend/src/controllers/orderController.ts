import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Order } from '../models/orderModel'
import getProductPrice from '../utils/getProductPrice'

export const getOrderByPaymentIntent = asyncHandler(
  async (req: Request, res: Response) => {
    const { paymentIntentId } = req.params
    const currency = 'COP'

    if (!paymentIntentId) {
      res.status(404)
      throw new Error('Error al consultar el pago')
    }

    const order = await Order.findOne({ paymentIntentId }).lean()

    if (!order) {
      res.status(404)
      throw new Error('Pedido no encontrado')
    }

    // Price conversion for order items
    const convertedItems = order.items.map((item) => {
      return {
        ...item,
        price: getProductPrice(item.price, currency)
      }
    })

    const orderSanitized = {
      _id: order._id.toString(),
      items: convertedItems,
      totalAmount: getProductPrice(order.totalAmount, currency),
      customerEmail: order.customerEmail,
      createdAt: order.createdAt.toLocaleDateString(), 
    }

    res.status(200).json({
      message: 'Pedido hallado exitosamente',
      order: orderSanitized,
    })
  },
)
