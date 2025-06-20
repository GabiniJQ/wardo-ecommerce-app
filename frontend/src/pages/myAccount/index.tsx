import { RootState } from '@/app/store'
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
    <div className='flex flex-col gap-4 p-4 bg-white md:mx-20 md:px-10 xl:mx-40 min-h-[550px]'>
      <h1 className='title text-primary text-center md:text-left'>Ajustes de cuenta</h1>

      <Outlet />
    </div>
  )
}

export default MyAccountPage
