import { CATEGORIES } from '@/consts/productCategories'
import { Button } from '@/shared/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/components/ui/carousel'
import useScreenSize from '@/shared/hooks/useScreenSize'
import Autoplay from 'embla-carousel-autoplay'
import { useState } from 'react'
import { useNavigate } from 'react-router'

const images = [
  {
    src: '/img/car1.webp',
    title: 'Encuentra productos únicos para cada momento de tu vida',
  },
  {
    src: '/img/car2.webp',
    title: 'Revisa las colecciones de las mejores marcas de moda',
  },
  {
    src: '/img/car3.webp',
    title: 'Encuentra productos únicos para cada momento de tu vida',
  },
]

const MainCarousel = () => {
  const [isAutoplaying, setIsAutoplaying] = useState<boolean | null>(true)
  const [isButtonShown, setIsButtonShown] = useState<boolean | null>(false)

  const isMobile = useScreenSize()

  const navigate = useNavigate()

  return (
    <div className='w-full relative max-w-[1920px] xl:h-[70vh] mx-auto'>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2500,
          }),
        ]}
        opts={{ loop: true }}
        className='w-full'
        onMouseEnter={() => {
          setIsAutoplaying((prevAutoplaying) => !prevAutoplaying)
          setIsButtonShown((prevButtonShown) => !prevButtonShown)
        }} // pause on hover
        onMouseLeave={() => {
          setIsAutoplaying((prevAutoplaying) => !prevAutoplaying)
          setIsButtonShown((prevButtonShown) => !prevButtonShown)
        }} // resume when not hovering
        isAutoplaying={isAutoplaying}
      >
        <CarouselContent className='max-h-[70vh]'>
          {images.map((img, i: number) => (
            <CarouselItem key={i}>
              <div className='relative overflow-hidden size-full'>
                <div className='absolute size-full top-0 left-0 bg-black/30 z-20'></div>

                <img
                  src={img.src}
                  alt={`img ${i + 1}`}
                  className='size-full max-h-[305px] sm:max-h-none object-cover'
                />

                <div className='absolute top-[50%] flex flex-col gap-2 justify-center px-12 w-full z-30 sm:top-[50%] sm:items-center xl:top-2/3'>
                  <h1 className='text-sm font-semibold max-w-[70%] text-white sm:title sm:max-w-full'>
                    {img.title}
                  </h1>

                  <Button
                    size={isMobile ? 'xs' : 'default'}
                    className='w-24 sm:w-auto sm:self-start lg:self-center z-30'
                    onClick={() => {
                      if (i === 0 || i === 2)
                        document
                          .getElementById('explore')
                          ?.scrollIntoView({ behavior: 'smooth' })
                        
                      if (i === 1)
                        navigate(
                          `/${CATEGORIES.CAMISETAS_PARA_HOMBRE.ORIGINAL}`
                        )
                    }}
                  >
                    <p className='text-[10px] sm:text-sm'>
                      {i === 0 && 'Explorar'}
                      {i === 1 && 'Ver colecciones'}
                      {i === 2 && 'Explorar'}
                    </p>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          isButtonShown={isButtonShown}
          className='text-primary'
        />
        <CarouselNext isButtonShown={isButtonShown} className='text-primary' />
      </Carousel>
    </div>
  )
}

export default MainCarousel
