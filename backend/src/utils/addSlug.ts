import Product from '@/models/productModel'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

// Generate slug from product title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Delete special characters
    .replace(/[\s]+/g, '-') // Replace spaces with '-'
    .replace(/--+/g, '-') // Replace multiple '-' with only one
}

async function addSlugToProducts() {
  try {
    // Get all products
    const products = await Product.find({})
    const productsArray = Array.from(products)

    console.log(`Encontrados ${productsArray.length} productos para procesar`)

    let processedCount = 0

    for (const product of productsArray) {
      if (product.title) {
        const slug = generateSlug(product.title)

        const result = await Product.updateOne(
          { _id: product._id },
          { $set: { slug } }
        )

        console.log(`Updated ${product.title}:`, result)

        if (result.modifiedCount === 0) {
          console.warn(`Producto con _id ${product._id} no fue actualizado.`)
        }

        processedCount++
        if (processedCount % 100 === 0) {
          console.log(`Procesados ${processedCount} productos`)
        }
      }
    }

    console.log(
      `Proceso completado. ${processedCount} productos actualizados con slug.`
    )
  } catch (error) {
    console.error('Error durante el proceso:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Conexión cerrada')
  }
}

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
    console.error('DB connection error:', error)
    process.exit(1)
  }
}

await connectDB()

addSlugToProducts()
