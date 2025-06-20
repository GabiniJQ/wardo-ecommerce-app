import { ROUTES } from '@/consts/routes'
import SignupForm from '@/pages/signup/SignupForm'
import { Link } from 'react-router'

const SignupPage = () => {
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

      </div>
    </div>
  )
}

export default SignupPage
