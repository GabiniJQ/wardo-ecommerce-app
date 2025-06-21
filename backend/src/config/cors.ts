import { CorsOptions } from 'cors'

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
]

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      console.log('Origin request: ', origin)
      return callback(null, true)
    }
    
    const error = new Error(`Blocked CORS origin: ${origin}`) as Error & { status?: number }
    error.status = 403
    callback(error)
  },
  credentials: true,
}