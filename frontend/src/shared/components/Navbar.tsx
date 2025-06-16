import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { HiSearch, HiShoppingCart } from 'react-icons/hi'
import { HiBars3 } from 'react-icons/hi2'
import useScreenSize from '@/shared/hooks/useScreenSize'
import { useEffect, useRef, useState } from 'react'
import MenuMobile from '@/shared/components/MenuMobile'
import Settings from '@/shared/components/Settings'
import MenuSheet from '@/shared/components/MenuSheet'
import { Link, useNavigate, useSearchParams  } from 'react-router'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store'
import { logout } from '@/features/auth/authSlice'
import { LogOut } from 'lucide-react'
import AddressesModal from '@/shared/components/AddressesModal'
import { Separator } from '@/shared/components/ui/separator'
import { ROUTES } from '@/consts/routes'
import { clearCart } from '@/features/cart/cartSlice'
import { formatCategoryText } from '@/shared/utils/utils'
import { setLastSearch } from '@/features/history/historySlice'

const Navbar = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(true)
  const [inputSearch, setInputSearch] = useState<string>(formatCategoryText(query))
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const isMobile = useScreenSize()

  const { user } = useSelector((state: RootState) => state.auth)
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const lastSearch = useSelector((state: RootState) => state.history.lastSearch)
  const dispatch = useDispatch<AppDispatch>()

  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
  }
  
  const handleSearch = (searchQuery: string) => {
    navigate(
      `/search?q=${encodeURIComponent(searchQuery)}`
    )
  }

  useEffect(() => {
    if (query) {
      setInputSearch(formatCategoryText(query))
      dispatch(setLastSearch(query))
    } else {
      if (lastSearch) {
        setInputSearch(formatCategoryText(lastSearch))
      }
    }
  }, [query, dispatch, lastSearch])

  return (
    <header className='relative w-full shadow z-30'>
      {/* Primary nav */}
      <div className='flex justify-between items-center h-[50px] px-2 gap-4 md:px-10 bg-primary text-primary-foreground  '>
        <div className='shrink-0'>
          <a href='/'>
            <img src='../../wardo-logo2.png' width={50} alt='Wardo logo' />
          </a>
        </div>

        <div
          className='flex items-center relative grow'
        >
          <div className='flex relative items-center w-full rounded md:focus-within:border-red-500'>
            <Input
              ref={searchInputRef}
              type='text'
              placeholder={
                isMobile ? '' : 'Buscar producto, categoría, marca...'
              }
              className='bg-white text-black border-blue-dark border-none rounded text-xs active:border-blue-dark placeholder:text-blue-dark/50 md:min-w-[400px] md:text-sm'
              onChange={(e) => setInputSearch(e.target.value)}
              value={inputSearch}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputSearch !== '') {
                  handleSearch(inputSearch)
                  searchInputRef.current?.blur()
                }
              }}
            />
            {!isMobile && (
              <Button 
                className='absolute right-0 bg-mustard-primary rounded-l-none rounded-r-[4px] cursor-pointer hover:bg-mustard-secondary'
                onClick={() => {
                  if (inputSearch !== '') {
                    handleSearch(inputSearch)
                  }
                }}
              >
                <HiSearch />
              </Button>
            )}
          </div>
        </div>

        {/* Settings and Cart */}
        <div className='flex justify-center items-center gap-1 h-full '>
          {isMobile ? (
            <Button
              variant='border'
              className={`cursor-pointer px-1 ${
                mobileMenuOpen ? 'bg-accent text-black' : ''
              }`}
              size={isMobile ? 'xs' : 'default'}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <HiBars3 className='size-6' />
            </Button>
          ) : (
            <Settings />
          )}
          <Link to={ROUTES.CART} className='flex items-center justify-center'>
            <Button
              variant='border'
              className='cursor-pointer px-1 shrink-0 relative size-full'
              size={isMobile ? 'xs' : 'default'}
              
            >
              <HiShoppingCart className='size-6' />
              {/* Cart items number */}
              {!isMobile && cartItems.length > 0 && (
                <span
                className='absolute bottom-[1px] right-1 border-[1px] p-[2px] text-[0.6rem] font-bold text-mustard-primary size-3 rounded flex items-center justify-center'
                >
                  {cartItems.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Secondary nav */}
      <div
        className='relative flex justify-center items-center bg-secondary text-secondary-foreground sm:px-2 md:px-10'
      >
        {!isMobile && (
          <div className='flex justify-between items-center w-full h-8'>
            {/* Menu bars and nav items */}
            <div className='flex items-center justify-between gap-4 h-8'>
              {!isMobile && (
                <MenuSheet
                  desktopMenuOpen={desktopMenuOpen}
                  setDesktopMenuOpen={setDesktopMenuOpen}
                />
              )}

              <Separator
                decorative
                orientation='vertical'
                className='data-[orientation=vertical]:h-2/3'
              />

              {/* location desktop */}
              {!isMobile && <AddressesModal />}

              <Separator
                decorative
                orientation='vertical'
                className='data-[orientation=vertical]:h-2/3'
              />

              <Link to='/'>
                <Button className='btn h-6 link text-xs hover:text-black'>
                  Ofertas del día
                </Button>
              </Link>

              <Separator
                decorative
                orientation='vertical'
                className='data-[orientation=vertical]:h-2/3'
              />

              <Link to='/'>
                <Button className='btn h-6 link text-xs hover:text-black sm:hidden md:flex'>
                  Productos populares
                </Button>
              </Link>

            </div>

            {/* User options */}
            {!user && (
              <div className='flex items-center gap-1 h-8'>
                <Separator
                decorative
                orientation='vertical'
                className='data-[orientation=vertical]:h-2/3'
              />
                <Link to={ROUTES.LOGIN}>
                  <Button
                    variant='ghost'
                    className='text-xs cursor-pointer hover:underline'
                    size='sm'
                  >
                    Ingresar
                  </Button>
                </Link>

                <Separator
                decorative
                orientation='vertical'
                className='data-[orientation=vertical]:h-2/3'
              />

                <Link to={ROUTES.SIGNUP}>
                  <Button
                    variant='ghost'
                    className='text-xs cursor-pointer hover:underline'
                    size='sm'
                  >
                    Crear cuenta
                  </Button>
                </Link>
              </div>
            )}

            {/* Logout Button */}
            {user && (
              <div className='flex justify-center items-center px-2 w-40'>
                <button className='flex justify-center items-center gap-1 btn text-black ' onClick={() => handleLogout()}>
                  <LogOut className='size-4' />
                  <a href='/' className='text-center text-xs hover:underline'>Cerrar sesión</a>
                </button>
              </div>
            )

            }
          </div>
        )}

        {/* Mobile secondary content */}
        {!mobileMenuOpen && isMobile && <AddressesModal />}

        {mobileMenuOpen && isMobile && <MenuMobile onClose={() => setMobileMenuOpen(false)} />}
      </div>
    </header>
  )
}

export default Navbar
