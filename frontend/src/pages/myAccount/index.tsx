import { RootState } from '@/app/store'
import BackButton from '@/shared/components/BackButton'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router'

const MyAccountPage = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const isChecked = useSelector((state: RootState) => state.auth.checkAuth.isChecked)

  const navigate = useNavigate()

  useEffect(() => {
    if (isChecked && !user?._id) {
      navigate('/login')
    }
  }, [isChecked, user, navigate])

  return (
    <div className='flex flex-col flex-1 gap-4 px-4 py-6 pb-10 bg-white md:mx-20 md:px-10 xl:mx-40'>
      <div className='flex items-center gap-2'>
        <BackButton />
        <h1 className='text-2xl font-bold sm:title text-primary text-center md:text-left'>Ajustes de cuenta</h1>
      </div>

      <Outlet />
    </div>
  )
}

export default MyAccountPage
