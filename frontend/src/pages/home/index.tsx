import useScreenSize from '@/shared/hooks/useScreenSize'
import CategoryMobile from '@/pages/home/CategoryMobile'
import Hero from '@/pages/home/Hero'
import MainCarousel from '@/pages/home/MainCarousel'
import ProductsCarousel from '@/pages/home/ProductsCarousel'
import Showcase from '@/pages/home/Showcase'
import Tags from '@/pages/home/Tags'

const HomePage = () => {
  const isMobile = useScreenSize()

  return (
    <>
      <MainCarousel />
      <main className='w-[90vw] max-w-[1920px] mx-auto'>
        <Hero />

        {/* Brand showcase */}
        <section className='flex justify-between flex-wrap gap-4  mx-auto '>
          <Showcase
            brand='Oster'
            phrase='Los pioneros en electrodomésticos'
          />
          <Showcase
            brand='Ikea'
            phrase='Decora con lo más elegante'
          />
          <Showcase
            brand='Jumbo'
            phrase='Provisiónate con alimentos de calidad'
          />
          <Showcase
            brand='Carrefour'
            phrase='Consigue la canasta familiar más económica'
          />
        </section>

        {/* Full width category for Desktop*/}
        {!isMobile && (
          <div className='my-8'>
            <ProductsCarousel
              header='Belleza y cuidado'
              displayed='full'
              category='belleza'
            />
          </div>
        )}
        {/* Mobile Category*/}
        {isMobile && (
          <div className='my-8'>
            <CategoryMobile header='Accesorios de cocina' category='accesorios-de-cocina' />
          </div>
        )}

        {/* Tags section*/}
        <Tags />
      </main>
    </>
  )
}

export default HomePage
