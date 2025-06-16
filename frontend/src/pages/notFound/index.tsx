import { AppDispatch, RootState } from '@/app/store'
import { checkAuth } from '@/features/auth/authSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const NotFoundPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch, user])
  return (
    <div className='flex flex-col p-6 md:p-20 md:flex-row'>
      <div className='md:w-1/2 md:pt-20 space-y-10'>
        <h1 className='text-5xl md:text-6xl text-primary'>
          Parece que este no es el camino...
        </h1>

        <p className='text-2xl font-semibold italic'>
          No encontramos la página que has solicitado o(TヘTo)
        </p>

        <a href='/' className='link text-primary text-2xl'>
          Regresar a la página principal.
        </a>
      </div>

      <div className='flex justify-center items-center md:w-1/2'>
        <img src='/404.png' alt='Not found page' />
      </div>
    </div>
  )
}

export default NotFoundPage
