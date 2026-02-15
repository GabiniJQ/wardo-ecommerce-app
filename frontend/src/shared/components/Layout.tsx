import Footer from '@/shared/components/Footer'
import Navbar from '@/shared/components/Navbar'
import { Outlet } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from '@/features/auth/authSlice'
import { AppDispatch, RootState } from '@/app/store'
import { Toaster } from '@/shared/components/ui/sonner'
import api from '@/lib/axios'
import {
  CACHE_KEY,
  shouldPingServer } from '@/shared/utils/wakeUpServer'
import { fetchCartProducts } from '@/features/products/productsSlice'


const Layout = () => {
  const [isLoading, setIsLoading] = useState(shouldPingServer())

  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const logoutSuccess = useSelector((state: RootState) => state.auth.logout.isSuccess)


  useEffect(() => {
    const pingServer = async () => {
      try {
        await api.get('/ping')
        localStorage.setItem(CACHE_KEY, `${Date.now()}`)
      } catch (err) {
        console.error('Error pinging server:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoading) pingServer()
  }, [isLoading])

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch, user])
  
  useEffect(() => {
    if (logoutSuccess) window.location.href = '/'
  }, [logoutSuccess])

  // Cart fetching
  useEffect(() => {
    // If no user logged
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (cart.length > 0) {
      dispatch(fetchCartProducts())
    }
  }, [dispatch])

  

  return (
    <div className='min-h-screen flex flex-col  min-w-[320px]'>
      <Navbar />
      <main className='flex flex-col flex-1  bg-white '>
        <Outlet />
      </main>

      <Toaster position='bottom-center' theme='light' />
      <Footer />
    </div>
  )
}

export default Layout
