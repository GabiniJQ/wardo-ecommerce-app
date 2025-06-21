import { RootState } from '@/app/store'
import { CATEGORIES } from '@/consts/productCategories'
import { ROUTES } from '@/consts/routes'
import GuestLoginButton from '@/shared/components/GuestLoginButton'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet'
import { ChevronRight } from 'lucide-react'
import { HiBars3 } from 'react-icons/hi2'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

type menuProps = {
  setDesktopMenuOpen: (desktopMenuOpen: boolean) => void
  desktopMenuOpen: boolean
}

const categories = Object.values(CATEGORIES)

const MenuSheet = ({ desktopMenuOpen, setDesktopMenuOpen }: menuProps) => {
  const user = useSelector((state: RootState) => state.auth.user)

  const navigate = useNavigate()

  // Display categories
  const displayCategories = categories.map((category) => (
    <div
      key={category.ORIGINAL}
      className='relative flex border-b-[1px] border-gray-300 w-full'
    >
      <span
        className='flex justify-between items-center w-full btn py-3 px-4 hover:text-primary hover:translate-x-2 transition'
        onClick={() => navigate(`/${category.ORIGINAL}`)}
      >
        {category.FORMATED}
        <ChevronRight className='size-5'/>
      </span>
    </div>
  ))

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          className='cursor-pointer h-6 w-8'
          size='sm'
          onClick={() => {
            setDesktopMenuOpen(!desktopMenuOpen)
          }}
        >
          <HiBars3 className='size-5' />
        </Button>
      </SheetTrigger>
      <SheetContent className='bg-white text-sm' side='left'>
        <SheetHeader className='py-1'>
          <SheetTitle>
            <div className='flex flex-col justify-center items-center'>
              <div className='shrink-0 self-start'>
                <a href=''>
                  <img
                    src='/img/wardo-logo2.png'
                    width={50}
                    alt='Wardo logo'
                  />
                </a>
              </div>

              <p className='text-primary md:text-lg font-bold'>Menu</p>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Main content */}
        <div className='flex flex-col gap-4 px-8'>
            <div className='flex flex-col gap-4'>
              {!user && <GuestLoginButton />}

              <Separator orientation='horizontal' />

              <div className='flex flex-col gap-4'>
                <p className='text-lg font-semibold'>Ajustes y ayuda</p>

                <div className='flex flex-col gap-3 '>
                  <SheetClose
                    className='link text-left'
                    onClick={() => navigate(ROUTES.MY_ACCOUNT)}
                  >
                    Ver ajustes de mi cuenta
                  </SheetClose>

                  <SheetClose
                    className='link text-left'
                    onClick={() => navigate(ROUTES.CART)}
                  >
                    Ver productos del carrito
                  </SheetClose>
                </div>
              </div>
            </div>

          <Separator orientation='horizontal' />

          {/* Category */}
          <div className='flex flex-col gap-2'>
            <h2 className='text-lg font-semibold'>Buscar por categoría</h2>

            <SheetClose
              className='w-full'
            >
              {displayCategories}
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MenuSheet
