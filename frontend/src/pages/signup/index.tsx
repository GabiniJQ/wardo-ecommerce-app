import { RootState } from '@/app/store'
import { ROUTES } from '@/consts/routes'
import { cn } from '@/lib/utils'
import SignupForm from '@/pages/signup/SignupForm'
import GuestLoginButton from '@/shared/components/GuestLoginButton'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'

const SignupPage = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const { isChecked } = useSelector((state: RootState) => state.auth.checkAuth)
  const navigate = useNavigate()

  useEffect(() => {
    if (isChecked && user?._id) {
      navigate('/')
    }
  }, [user, navigate, isChecked])

  return (
    <div className='flex flex-col w-full px-6 sm:max-w-[400px] sm:mx-auto gap-4 mb-14'>
      <div className='flex flex-col gap-6 w-full border-2 border-gray-300 p-6 shadow rounded'>
        <h1 className='text-lg font-bold text-center'>Crea tu cuenta</h1>

        <SignupForm />
      </div>

      <div className='flex flex-col p-6 gap-3 border-2 border-gray-300 shadow rounded '>
        <div className='flex gap-1 flex-wrap'>
          <p className=''>¿Ya tienes cuenta?</p>
          <Link to={ROUTES.LOGIN} className='text-primary link'>
            Ingresar.
          </Link>
        </div>

        <div
          className={cn(
            'w-full relative text-center before:absolute before:top-1/2 before:-left-2 before:content-[""] before:w-1/2 before:border-t-[1px] before:border-gray-300',
            'after:absolute after:top-1/2 after:-right-2 after:content-[""] after:w-1/2 after:border-t-[1px] after:border-gray-300'
          )}
        >
          o
        </div>

        <GuestLoginButton />

      </div>
    </div>
  )
}

export default SignupPage
