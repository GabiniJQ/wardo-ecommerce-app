import { Outlet } from 'react-router'

const ForgotPasswordLayout = () => {
  return (
    <div className='flex flex-col gap-10 px-10 md:max-w-[600px] md:mx-auto'>
      <h1 className='text-primary title'>Reinicio de contraseña</h1>

      <Outlet />
    </div>
  )
}

export default ForgotPasswordLayout
