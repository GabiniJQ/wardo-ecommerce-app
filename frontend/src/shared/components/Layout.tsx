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

const Layout = () => {
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const pingServer = async () => {
      setIsLoading(true)
      try {
        await api.get('/ping')
      } catch (error) {
        console.error('Ping failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    pingServer()
  }, [])

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch, user])
  
  if (isLoading) {
    return <FullScreenLoader />
  }
  
  return (
    <div className='app flex flex-col bg-secondary min-w-[320px] min-h-screen'>
      <Navbar />
      <main className='flex-1 bg-white md:bg-secondary'>
        <Outlet />
      </main>

      <Toaster position='bottom-center' theme='light' />
      <Footer />
    </div>
  )
}

export default Layout
