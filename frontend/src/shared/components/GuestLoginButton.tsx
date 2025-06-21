import { AppDispatch, RootState } from '@/app/store'
import { loginDemo } from '@/features/auth/authSlice'
import Loader from '@/shared/components/Loader'
import { Button } from '@/shared/components/ui/button'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GuestLoginButton = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, isError } = useSelector((state: RootState) => 
    state.auth.loginDemo
  )

  useEffect(() => {
    if (isError) console.log('Error con loginDemo')
  }, [isError])

  return (
    <Button
      className='bg-green-300 text-black hover:bg-green-600'
      onClick={() => dispatch(loginDemo())}
    >
      {
        isLoading
          ? <Loader className='size-4' />
          : 'Ingresar con usuario demo'
      }
    </Button>
  )
}

export default GuestLoginButton
