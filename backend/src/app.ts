import express from 'express'
import customerRoutes from './routes/customerUserRoutes'
import adminRoutes from './routes/adminUserRoutes'
import { errorHandler } from './middlewares/errorMiddleware'
import connectDB from './config/db'
import cookieParser from 'cookie-parser'
import productsRoutes from './routes/productsRoutes'
import cartRoutes from './routes/cartRoutes'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false}))

app.use('/api/users', customerRoutes, adminRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/cart', cartRoutes)
app.use(errorHandler)


app.listen(PORT, ()=> {
  connectDB()

  console.log(`Server running on PORT ${PORT}`)
})
