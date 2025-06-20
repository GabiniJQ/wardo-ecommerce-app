import { AppDispatch, RootState } from '@/app/store'
import Footer from '@/shared/components/Footer'
import { checkAuth } from '@/features/auth/authSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet } from 'react-router'
import { Toaster } from '@/shared/components/ui/sonner'

const AuthLayout = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch, user])
  return (
    <div className='flex flex-col justify-between min-h-screen'>
      <div className='max-w-20 mx-auto'>
        <Link to='/'>
          <img src='/img/wardo-logo2.png' width={80} alt='Wardo logo' />
        </Link>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <Toaster 
        position="bottom-center"
        theme='light'
      />

      <Footer />
    </div>
    
  )
}

export default AuthLayout
