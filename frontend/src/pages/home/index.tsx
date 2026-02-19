import useScreenSize from '@/shared/hooks/useScreenSize'
import CategoryMobile from '@/pages/home/CategoryMobile'
import MainCarousel from '@/pages/home/MainCarousel'
import ProductsCarousel from '@/pages/home/ProductsCarousel'
import Showcase from '@/pages/home/Showcase'
import Tags from '@/pages/home/Tags'
import TopCategory from '@/pages/home/TopCategory'
import { CATEGORIES } from '@/consts/productCategories'
import { Separator } from '@/shared/components/ui/separator'
import { MdStars } from 'react-icons/md'
import { HiFire, HiSearch } from 'react-icons/hi'
import { GroceryPromo, WatchesPromo } from '@/pages/home/CategoryBanner'
import CategoryCardsMenu from '@/shared/components/CategoryCardsMenu'

const HomePage = () => {
  const isMobile = useScreenSize()

  return (
    <div>
      <MainCarousel />

      {/* Benefits banner */}
      {/* <div className='flex justify-evenly items-center bg-primary/40 text-blue-dark font-bold py-2 h-12 2xl:max-w-[1920px] 2xl:mx-auto'>
        <div className='hidden sm:flex sm:items-center sm:gap-2'>
          <HiFire className='size-4 sm:size-8' />
          <p className='text-sm'>Productos en tendencia</p>
        </div>

        <Separator
          orientation='vertical'
          className='hidden sm:block bg-blue-dark'
        />

        <div className='flex items-center gap-2'>
          <HiShieldCheck className='size-[14px] sm:size-8' />
          <p className='text-xs leading-0'>Garantía asegurada</p>
        </div>

        <Separator orientation='vertical' className='bg-blue-dark' />

        <div className='flex items-center gap-2'>
          <HiTruck className='size-[14px] sm:size-8' />
          <a className='text-xs leading-0'>Primer envío gratis</a>
        </div>
      </div> */}

      {/* Page body */}
      <div className='max-w-[1440px] mx-auto'>
        <div className=' bg-white'>
          {/* MOBILE: Category cards section */}
          {isMobile && (
            <div className='flex flex-col gap-6 px-4 py-4'>
              <h2 className='subtitle text-primary self-center'>
                Buscar por categoría
              </h2>

              <CategoryCardsMenu className='w-full sm:max-w-[50%] sm:mx-auto' />
            </div>
          )}

          <div id='explore' className='bg-white max-w-[1920px] 2xl:mx-auto'>
            {/* Dektop: Categories promotion */}
            {!isMobile && (
              <div className='grid sm:grid-cols-2 gap-6 p-6 justify-evenly bg-white '>
                <WatchesPromo />
                <GroceryPromo />
              </div>
            )}

            {/* Desktop: Related section  Mobile: Category carousel*/}
            <section className='relative p-4 bg-white sm:p-6'>
              <div className='size-full sm:rounded-none sm:shadow-none'>
                {isMobile ? (
                  <CategoryMobile
                    header='Ofertas populares 🔥'
                    category='portatiles'
                  />
                ) : (
                  <TopCategory />
                )}
              </div>
            </section>

            {/* Separator Brands showcase */}
            <div className='pb-10 space-y-10'>
              <Separator className='data-[orientation=horizontal]:w-[90%] mx-auto' />

              <div className='flex flex-col items-center justify-center text-primary'>
                <MdStars className='size-8' />
                <h2 className='text-2xl font-bold text-center sm:title'>
                  Marcas destacadas
                </h2>
              </div>
            </div>

            {/* Brand showcase */}
            <section className='grid gap-4 px-4 py-4 grid-cols-2 md:p-20 lg:grid-cols-4 lg:p-6'>
              <Showcase brand='Oster' />
              <Showcase brand='Ikea' />
              <Showcase brand='Jumbo' />
              <Showcase brand='Carrefour' />
            </section>

            {/* Separator categories showcase */}
            <div className='mt-10 pb-10 space-y-10 bg-white'>
              <Separator className='' />

              <div className='flex flex-col items-center justify-center text-red-400'>
                <HiFire className='size-8' />
                <h2 className='text-2xl font-bold text-center sm:title '>
                  Categorías populares
                </h2>
              </div>
            </div>

            {/* Full width category for Desktop*/}
            <section className='bg-white'>
              {!isMobile && (
                <>
                  <div className='px-4 py-10 2xl:px-10'>
                    <ProductsCarousel
                      basis='sm:basis-1/3 lg:basis-1/6'
                      header='Comestibles'
                      category={CATEGORIES.COMESTIBLES.ORIGINAL}
                    />
                  </div>

                  <div className='px-4 py-10 2xl:px-10'>
                    <ProductsCarousel
                      basis='sm:basis-1/3 lg:basis-1/6'
                      header='Accesorios de cocina'
                      category={CATEGORIES.ACCESORIOS_DE_COCINA.ORIGINAL}
                    />
                  </div>
                </>
              )}
              {/* Mobile Category*/}
              {isMobile && (
                <div className='p-4'>
                  <CategoryMobile
                    header='Accesorios de cocina'
                    category={CATEGORIES.ACCESORIOS_DE_COCINA.ORIGINAL}
                  />
                </div>
              )}
            </section>

            {/* Separator Tags section*/}
            <div className='pt-5 sm:pt-10 space-y-10 bg-white'>
              <Separator className='data-[orientation=horizontal]:w-[90%] mx-auto' />

              <div className='flex flex-col items-center justify-center text-primary'>
                <HiSearch className='size-8' />
                <h2 className='text-2xl font-bold text-center sm:title '>
                  Etiquetas más buscadas
                </h2>
              </div>
            </div>

            {/* Tags section*/}
            <section className='px-4 py-5 bg-white'>
              <Tags />
            </section>

            {/* Desktop: Category cards section */}
            {!isMobile && (
              <div className='flex flex-col gap-6 px-4 py-10'>
                <h2 className='subtitle text-primary self-center'>
                  Buscar por categoría
                </h2>

                <CategoryCardsMenu className='w-full sm:max-w-[50%] sm:mx-auto' />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
