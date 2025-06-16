import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import productsReducer from '@/features/products/productsSlice'
import cartReducer from '@/features/cart/cartSlice'
import historyReducer from '@/features/history/historySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    history: historyReducer,
  },
})

// 👉 Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch