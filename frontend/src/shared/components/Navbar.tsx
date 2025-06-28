import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { HiSearch, HiShoppingCart, HiViewGrid } from 'react-icons/hi'
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/shared/components/ui/navigation-menu'
import CategoryCardsMenu from '@/shared/components/CategoryCardsMenu'

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
    if (user) {
      dispatch(logout({ userId: user._id, email: user.email }))
      dispatch(clearCart())
    }
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
    <header className='relative w-full shadow z-30 bg-primary'>
      {/* Secondary nav */}
      <div
        className='relative flex justify-center items-center px-2 bg-white text-secondary-foreground py-2 sm:px-10 2xl:max-w-[1920px] 2xl:mx-auto'
      >
        {!isMobile && (
          <div className='flex justify-between items-center w-full h-full'>
            {/* Menu bars and nav items */}
            <div className='flex items-center justify-between gap-4 h-full'>
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

              {!isMobile && (
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className='text-sm gap-2 btn'>
                        <HiViewGrid />
                        Categorías
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>

                        {/* Category Cards component */}
                        <CategoryCardsMenu />

                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>

                  {/* <NavigationMenuViewport className='-left-52' /> */}
                </NavigationMenu>
              )}
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
                    className='h-8'
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
                    className='h-8'
                  >
                    Crear cuenta
                  </Button>
                </Link>
              </div>
            )}

            {/* Logout Button */}
            {user && (
              <div className='flex items-center gap-2 h-full'>
                <Separator
                  decorative
                  orientation='vertical'
                  className='data-[orientation=vertical]:h-2/3'
                />
                <div className='flex justify-center items-center h-full w-full px-2'>
                  <Button
                    variant='ghost'
                    className='flex justify-center items-center gap-2 btn text-black h-8 w-full'
                    onClick={() => handleLogout()}
                  >
                    <LogOut className='size-4 ' />
                    <span className='text-center text-sm w-full '>Cerrar sesión</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile secondary content */}
        {isMobile && <AddressesModal />}
        
      </div>

      {/* Primary nav */}
      <div className='flex justify-between items-center gap-4 px-2 bg-primary text-primary-foreground sm:px-10  2xl:max-w-[1920px] 2xl:mx-auto'>
        <div className='w-[60px] sm:w-[100px] shrink-0'>
          <a href='/'>
            <img src='/img/wardo-logo2.png' className='size-full' alt='Wardo logo' />
          </a>
        </div>

        <div
          className='flex items-center relative grow max-w-2/3'
        >
          <div className='flex relative items-center w-full rounded md:focus-within:border-red-500'>
            <Input
              ref={searchInputRef}
              type='text'
              placeholder={
                isMobile ? '' : 'Buscar producto, categoría, marca...'
              }
              className='bg-white text-black border-blue-dark px-6 py-2 border-none rounded-full text-xs active:border-blue-dark placeholder:text-blue-dark/50 sm:py-6 md:min-w-[400px] md:text-sm'
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
                className='absolute right-0 bg-mustard-primary h-full rounded-l-none rounded-r-full cursor-pointer overflow-hidden hover:bg-mustard-secondary'
                onClick={() => {
                  if (inputSearch !== '') {
                    handleSearch(inputSearch)
                  }
                }}
                aria-label='Search button'
              >
                <HiSearch className='size-6' />
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
              <HiShoppingCart className='size-5 sm:size-10' />
              {/* Cart items number */}
              {!isMobile && cartItems.length > 0 && (
                <span
                className='absolute bottom-[1px] right-1  text-[0.6rem] font-bold text-white bg-mustard-primary size-3 rounded flex items-center justify-center'
                >
                  {cartItems.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      
    {mobileMenuOpen && isMobile && <MenuMobile onClose={() => setMobileMenuOpen(false)} />}
    </header>
  )
}

export default Navbar
