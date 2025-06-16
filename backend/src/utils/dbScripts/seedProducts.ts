import mongoose from 'mongoose'
import Product from '../../models/productModel'
import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config()

// MongoDB Connection
const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI)
      console.log('MongoDB connected')
    } else {
      throw new Error('MONGO_URI not defined')
    }
  } catch (error) {
    console.error('DB connection error:', error.message)
    process.exit(1)
  }
}

await connectDB()

// Translate product title, description and category
const translateText = async (text: string) => {
  try {
    if (process.env.TRANSLATE_API) {
      const res = await axios.post(
        process.env.TRANSLATE_API,
        {
          q: text,
          source: 'en',
          target: 'es',
          format: 'text',
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      return res.data.translatedText
    }
  } catch (error) {
    console.error('Error traduciendo:', error.message)
    return text
  }
}

const shippingOptions = [
  'Envío estándar de 7 a 8 días hábiles',
  'Envío estándar de 10 a 12 días hábiles',
]

const getRandom = (array: string[]) =>
  array[Math.floor(Math.random() * array.length)]

const seedProducts = async () => {
  try {
    const { data } = await axios.get('https://dummyjson.com/products?limit=100')

    const translatedProducts = []

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

    for (const product of data.products) {
      const title = await translateText(product.title)
      const description = await translateText(product.description)
      const category = await translateText(product.category)

      const translatedReviews = []
      if (product.reviews) {
        for (const review of product.reviews) {
          const translatedComment = await translateText(review.comment)
          translatedReviews.push({ ...review, comment: translatedComment })
        }
      }

      await delay(200) // Lower server loading

      translatedProducts.push({
        title,
        description,
        price: product.price,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
        category,
        brand: product.brand || 'Genérico',
        images: product.images,
        rating: product.rating,
        reviews: translatedReviews,
        shippingInformation: getRandom(shippingOptions),
      })
    }

    for (const p of translatedProducts) {
      try {
        await Product.create(p)
        console.log('Created: ', p.title)
      } catch (error) {
        console.error('Error inserting product:', error.message)
      }
    }
    console.log('Products seeded successfully')
  } catch (error) {
    console.error('Error seeding products: ', error.message)
  } finally {
    mongoose.disconnect()
  }
}

seedProducts()
