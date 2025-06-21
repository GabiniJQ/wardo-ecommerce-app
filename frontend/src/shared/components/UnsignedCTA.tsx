import { Button } from '@/shared/components/ui/button'
import { ROUTES } from '@/consts/routes'
import { Link } from 'react-router'
import GuestLoginButton from '@/shared/components/GuestLoginButton'

const UnsignedCTA = () => {
  return (
    <div className='flex flex-col w-full bg-white gap-1'>
      <GuestLoginButton />
      
      <Link to={ROUTES.LOGIN}><Button className='w-full'>Iniciar sesión</Button></Link>
      <div className='flex flex-col gap-1 text-xs my-1'>
        <p className='text-black'>¿No tienes cuenta?</p>
        <Link className='text-blue-primary hover:cursor-pointer hover:underline' to={ROUTES.SIGNUP}>Créala aquí.</Link>
      </div>
    </div>
  )
}

export default UnsignedCTA
