import { CartDb } from './cartTypes'
import { Types, Document } from 'mongoose'

export type Address = {
  _id: Types.ObjectId
  isMain: boolean
  fullName: string
  phone: string
  department: string
  city: string
  addressInfo: {
    street: string
    number1: string
    number2: string
    additionalInfo?: string
    postalCode?: string
  }
  addressType: 'hogar' | 'trabajo' | 'casillero'
}

export type UserDb = {
  _id: Types.ObjectId
  name: string
  email: string
  password: string
  role: 'admin' | 'customer'
  addresses: Address[]
  cart: {
    _id: Types.ObjectId
    productId: Types.ObjectId
    quantity: number
  }[]
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
  resetPasswordToken?: string
  resetPasswordExpiresAt?: Date | number
  __v: number
}

export type UserResponse = {
  _id: string
  name: string
  email: string
  role: 'admin' | 'customer'
  addresses?: Address[]
  lastLogin: Date
}

export interface UserDocument extends Document {
  _id: Types.ObjectId
  name: string
  email: string
  password: string
  role: 'admin' | 'customer'
  addresses: Address[]
  cart: CartDb
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
  resetPasswordToken?: string
  resetPasswordExpiresAt?: Date
  __v: number
}