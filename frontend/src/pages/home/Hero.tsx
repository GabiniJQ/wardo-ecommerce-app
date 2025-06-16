import useScreenSize from '@/shared/hooks/useScreenSize'
import TopCategory from '@/pages/home/TopCategory'
import CategoryMobile from '@/pages/home/CategoryMobile'
const Hero = () => {
  const isMobile = useScreenSize()
  return (
    <section className='w-full max-w-[1920px] mx-auto relative pb-4'>
      <div className='-mt-24'>
        {isMobile ? (
          <CategoryMobile
            header='Computadores portátiles'
            category='portatiles'
          />
        ) : (
          <TopCategory />
        )}
      </div>
    </section>
  )
}

export default Hero
