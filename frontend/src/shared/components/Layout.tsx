import Footer from '@/shared/components/Footer'
import Navbar from '@/shared/components/Navbar'
import { Outlet } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from '@/features/auth/authSlice'
import { AppDispatch, RootState } from '@/app/store'
import { Toaster } from '@/shared/components/ui/sonner'
import api from '@/lib/axios'
import FullScreenLoader from '@/pages/home/FullScreenLoader'
import {
  CACHE_KEY,
  shouldPingServer } from '@/shared/utils/wakeUpServer'

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

  if (isLoading) {
    return <FullScreenLoader />
  }
  
  return (
    <div className='bg-secondary min-w-[320px] min-h-screen'>
      <Navbar />
      <main className='flex-1 mt-[1px] bg-white md:bg-secondary'>
        <Outlet />
      </main>

      <Toaster position='bottom-center' theme='light' />
      <Footer />
    </div>
  )
}

export default Layout
