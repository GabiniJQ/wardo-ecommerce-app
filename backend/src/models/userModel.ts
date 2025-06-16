import { UserDb } from '../types/userTypes.js'
import mongoose, { Types } from 'mongoose'

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  isMain: { type: Boolean, required: true },
  addressType: {
    type: String,
    enum: ['hogar', 'trabajo', 'casillero']
  },
  addressInfo: {
    street: { type: String, required: true }, 
    number1 : { type: String, required: true },
    number2: { type: String, required: true },
    additionalInfo: { type: String },
    postalCode: { type: String },
  },
  department: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
})

const userSchema = new mongoose.Schema<UserDb>(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
    },
    addresses: [addressSchema],
    cart: {
      items: [{
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 }
      }],
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
  },
  {
    timestamps: true,
  }
)

export const User = mongoose.model<UserDb>('User', userSchema)
export default User
