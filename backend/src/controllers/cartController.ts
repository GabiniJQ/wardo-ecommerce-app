import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import { CartDb, CartItemDb } from '../types/cartTypes.js'
import { UserDocument } from '../types/userTypes.js'
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Document } from 'mongoose'

export const getCartById = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params

  if (!userId) {
    res.status(400)
    throw new Error('Usuario requerido en params')
  }

  const cartData = await User.findById(userId).select('cart') as { cart: CartDb } | null

  if (!userId) {
    res.status(400)
    throw new Error('Usuario requerido en params')
  }

  if (!cartData) {
    res.status(404)
    throw new Error('Carrito del usuario no disponible')
  }

  res
    .status(200)
    .json({ message: 'Carrito del usuario encontrado', items: cartData.cart.items })
})

export const addItemById = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params
  const cartItem = req.body as CartItemDb

  const user = await User.findById(userId).select('cart') as Document & UserDocument

  if (!user) {
    res.status(404)
    throw new Error('Usuario no encontrado')
  }
  
  // Check product already exists
  const existing = user.cart.items.find((item: CartItemDb) => 
    item.productId.toString() === cartItem.productId
  )

  if (existing) {
    existing.quantity += cartItem.quantity
    user.save()
    res
      .status(200)
      .json({ message: 'Producto actualizado exitosamente', item: existing})
  } else {
    user.cart.items.push(cartItem)
    user.save()
    res
      .status(200)
      .json({ message: 'Producto agregado al carrito exitosamente', item: cartItem})
  }
})

export const removeItemCartById = asyncHandler(async (req: Request, res: Response) => {
  const { productId, userId } = req.params

  const user = await User.findById(userId).select('cart') as Document & UserDocument
  
  const updatedItems = user.cart.items.filter((item: CartItemDb) =>
    item.productId.toString() !== productId
  )

  if (updatedItems.length === user.cart.items.length) {
    res.status(404)
    throw new Error('Producto no encontrado en el carrito')
  }
  
  // Update items and save user
  user.cart.items = updatedItems
  await user.save()

  res.status(200).json({ message: 'Producto eliminado exitosamente', items: updatedItems})

})

export const updateItemById = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params
  const { quantity, _id } = req.body

  const user = await User.findById(userId).select('cart') as Document & UserDocument

  const productUpdated = user.cart.items.find((item: CartItemDb) => item._id.toString() === _id)

  if (!productUpdated) {
    res.status(404)
    throw new Error('Producto no encontrado')
  }

  productUpdated.quantity = quantity
  user.save()
  res
    .status(200)
    .json({ message: 'Producto actualizado exitosamente', item: productUpdated })
})