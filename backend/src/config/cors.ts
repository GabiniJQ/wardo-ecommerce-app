import { CorsOptions } from 'cors'

const allowedOrigins = [
  'http://localhost:5173',
  process.env.LOCAL_CLIENT_URL, // Local IP
  process.env.CLIENT_URL,
].filter(Boolean)

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    console.log('📍 Request origin:', origin) // Check your Render logs
    if (!origin) {
      console.log('⚠️ No origin header - allowing')
      return callback(null, true)
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed')
      return callback(null, true)
    }
    
    console.log('❌ Origin blocked:', origin)
    const error = new Error(`Blocked CORS origin: ${origin}`) as Error & {
      status?: number
    }
    error.status = 403
    callback(error)
  },
  credentials: true,
  exposedHeaders: ['Set-Cookie'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
}
