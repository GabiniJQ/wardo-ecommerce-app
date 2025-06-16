import Footer from '@/shared/components/Footer'
import Navbar from '@/shared/components/Navbar'
import { Outlet } from 'react-router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from '@/features/auth/authSlice'
import { AppDispatch, RootState } from '@/app/store'
import { Toaster } from '@/shared/components/ui/sonner'

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch, user])

  return (
    <div className='app flex flex-col bg-secondary min-w-[320px] min-h-screen'>
      <Navbar />
      <main className='flex-1'>
        <Outlet />
      </main>

      <Toaster position='bottom-center' theme='light' />
      <Footer />
    </div>
  )
}

export default Layout
