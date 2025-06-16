import { RootState } from '@/app/store'
import { ROUTES } from '@/consts/routes'
import { cn } from '@/shared/utils/utils'
import LoginForm from '@/pages/login/LoginForm'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'

const LoginPage = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  })

  return (
    <div className='flex flex-col w-2/3 max-w-[400px] mx-auto gap-4'>
      <div className='flex flex-col gap-6 w-full border-2 border-gray-300 p-6 shadow rounded'>
        <h1 className='subtitle text-primary'>Ingresa los datos de tu cuenta</h1>

        <LoginForm />
      </div>

      <div className='flex flex-col p-6 gap-3 border-2 border-gray-300 shadow rounded '>
        <div className='flex gap-1 flex-wrap'>
          <p className=''>¿No tienes cuenta?</p>
          <Link to={ROUTES.SIGNUP} className='text-primary link'>Créala aquí.</Link>
        </div>

        <div
          className={cn(
            'w-full relative text-center before:absolute before:top-1/2 before:-left-2 before:content-[""] before:w-1/2 before:border-t-[1px] before:border-gray-300',
            'after:absolute after:top-1/2 after:-right-2 after:content-[""] after:w-1/2 after:border-t-[1px] after:border-gray-300'
          )}
        >
          o
        </div>

        <div>Continuar con Google</div>
      </div>
    </div>
  )
}

export default LoginPage
