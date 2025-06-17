import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'

import connectDB from './config/db.js'
import customerRoutes from './routes/customerUserRoutes.js'
import adminRoutes from './routes/adminUserRoutes.js'
import { errorHandler } from './middlewares/errorMiddleware.js'
import productsRoutes from './routes/productsRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import pingRoutes from './routes/pingRoutes.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const allowedOrigins = ['http://localhost:5173', process.env.CLIENT_URL]
const app = express()

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false}))

app.use('/api/users', customerRoutes, adminRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/ping', pingRoutes)
app.use(errorHandler)



app.listen(PORT, ()=> {
  connectDB()

  console.log(`Server running on PORT ${PORT}`)
})
