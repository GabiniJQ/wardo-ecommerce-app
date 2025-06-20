import { Button } from '@/shared/components/ui/button'
import { Link, useNavigate } from 'react-router'
import { ROUTES } from '@/consts/routes'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store'
import { logout } from '@/features/auth/authSlice'
import { HiHome, HiUser, HiViewGrid } from 'react-icons/hi'
import { LogOut } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion'
import { CATEGORIES } from '@/consts/productCategories'

const MenuMobile = ({ onClose }: {
  onClose?: () => void
}) => {
  const { user } = useSelector((state: RootState) => state.auth)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const firstLetterName = user?.name.charAt(0)

  const categoriesArray = Object.values(CATEGORIES)

  return (
    <div className='w-full bg-white p-6 border border-t'>
      <div className='flex flex-col gap-2 w-full border-b-[1px] border-gray-300'>
        {!user && (
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col gap-2'>
              <h1 className='font-semibold'>¡Espera un segundo! </h1>
              <p className='text-sm'>
                Ingresa para mejorar tu experiencia de compra, ver tus favoritos,
                tus pedidos y más!
              </p>
            </div>

            <div className='flex justify-center items-center py-4 gap-2'>
              <Link to={ROUTES.LOGIN} className='w-full'>
                <Button className='w-full btn'>
                  Ingresar
                </Button>
              </Link>
              <Link to={ROUTES.SIGNUP} className='w-full'>
                <Button className=' w-full btn' variant='outline'>
                  Crear cuenta
                </Button>
              </Link>
            </div>
          </div>
        )}

        {user && (
          <div className='flex w-full px-4 pb-4'>
            {/* User Avatar Letter */}
            {user && (
              <div className='flex justify-center items-center w-1/3'>
                <div className='w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold'>
                  {firstLetterName}
                </div>
              </div>
            )}

            <div className='w-full'>
              <h1 className='font-semibold line-clamp-1'>Hola, {user?.name}</h1>
              <p className='text-sm'>
                Explora tus listas de productos favoritos y las ofertas que tenemos para ofrecerte.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className='flex flex-col justify-center'>
        <div className='flex items-center h-12  border-b-xs-gray'>
          <a href='/' className='flex items-center gap-2'>
            <HiHome />
            Inicio
          </a>
        </div>

        <div className='flex items-center h-12  border-b-xs-gray'>
          <a href={ROUTES.MY_ACCOUNT} className='flex items-center gap-2'>
            <HiUser />
            Mi cuenta
          </a>
        </div>
        
        <div className='flex items-center  border-b-xs-gray '>
          <Accordion type='single' collapsible  className='w-full '>
            <AccordionItem value='item-1'>
              <AccordionTrigger className='text-base font-normal py-3'>
                <div className='flex items-center gap-2'>
                  <HiViewGrid />
                  Categorías
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className='flex flex-col' onClick={onClose}>
                  {categoriesArray.map((cat) => (
                    <Link 
                      to={`/${cat.ORIGINAL}`}
                      className='flex items-center h-12  border-b-xs-gray '
                    >
                    {cat.FORMATED}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {user && (
          <div className='flex items-center h-12  border-b-xs-gray '>
            <Button
              className='h-full p-0 text-base has-[>svg]:px-0'
              variant='border'
              onClick={() => {
                dispatch(logout())
                navigate('/')
              }}
            >
              <LogOut />
              Cerrar sesión
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuMobile
