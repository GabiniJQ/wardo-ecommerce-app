import { ProductDb } from '../types/productTypes'
import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  reviewerName: {
    type: String,
    required: true,
  },
  reviewerEmail: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    brand: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [reviewSchema],
    shippingInformation: {
      type: String,
      enum: [
        'Envío estándar de 7 a 8 días hábiles',
        'Envío estándar de 10 a 12 días hábiles',
      ],
      default: 'Envío estándar de 8 a 12 días hábiles',
    },
  },
  { timestamps: true }
)

productSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  brand: 'text',
}, {
  weights: {
    title: 5,
    brand: 4,
    category: 3,
    description:1,
  }
})

const Product = mongoose.model<ProductDb>('Product', productSchema)
export default Product