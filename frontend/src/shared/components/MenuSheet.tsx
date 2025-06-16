import { CATEGORIES } from '@/consts/productCategories'
import { ROUTES } from '@/consts/routes'
import { Button } from '@/shared/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet'
import { HiBars3 } from 'react-icons/hi2'
import { useNavigate } from 'react-router'

type menuProps = {
  setDesktopMenuOpen: (desktopMenuOpen: boolean) => void
  desktopMenuOpen: boolean
}

const categories = Object.values(CATEGORIES)

const MenuSheet = ({ desktopMenuOpen, setDesktopMenuOpen }: menuProps) => {
  const navigate = useNavigate()

  // Display categories
  const displayCategories = categories.map((category) => (
    <div
      key={category.ORIGINAL}
      className='relative flex border-b-[1px] border-gray-300 w-full'
    >
      <span
        className='flex justify-between w-full btn py-2 px-4 after:content-[">"] after:font-bold hover:text-primary'
        onClick={() => navigate(`/${category.ORIGINAL}`)}
      >
        {category.FORMATED}
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
                    src='../../wardo-logo2.png'
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
          <div className='grid grid-cols-2'>
            <div className='flex flex-col gap-3 p-2'>
              <div>
                <a href='' className='link'>
                  Ver ofertas del día
                </a>
              </div>

              <div>
                <a href='' className='link'>
                  Productos recomendados
                </a>
              </div>
            </div>

            <div className='flex flex-col gap-3 relative p-2 bg-primary/10'>
              <div>
                <SheetClose
                  className='link text-left'
                  onClick={() => navigate(ROUTES.MY_ACCOUNT)}
                >
                  Mi cuenta
                </SheetClose>
              </div>

              <div>
                <a className='link' href=''>
                  Suscribirse a novedades por correo electrónico
                </a>
              </div>

              <div>
                <a className='link' href=''>
                  Ayuda
                </a>
              </div>
            </div>
          </div>

          {/* Category/Subcategory */}
          <div className='flex flex-col gap-2'>
            <h2 className='font-semibold'>Buscar por categoría</h2>

            <SheetClose
              className='w-full'
            >
              {displayCategories}
            </SheetClose>

            <div className='flex flex-col'>
              {/* All categories page link button */}
              <div className='relative'>
                <Button
                  className='justify-between w-full btn py-6 hover:text-primary'
                  variant='ghost'
                >
                  Ver más...
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MenuSheet
