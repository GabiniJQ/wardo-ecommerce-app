import { CATEGORIES } from '@/consts/productCategories'
import { cn } from '@/lib/utils'
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
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

const images = [
  {
    title: 'Lo mejor en tecnología -50% de descuento',
    textClasses: '',
    src: '/img/carousel1.webp',
    srcSm: '/img/carousel1short.webp',
    category: 'Portátiles y computadores',
  },
  {
    title: 'Colecciones de moda del 2026',
    textClasses: '',
    src: '/img/carousel2_.webp',
    srcSm: '/img/carousel2_.webp',
    category: 'Ropa de moda',
  },
  {
    title: 'Productos únicos para tu hogar',
    textClasses: '',
    src: '/img/carousel3.webp',
    srcSm: '/img/carousel3short.webp',
    category: 'Decoración de hogar',
  },
]

const MainCarousel = () => {
  const [isAutoplaying, setIsAutoplaying] = useState<boolean | null>(true)
  const [isButtonShown, setIsButtonShown] = useState<boolean | null>(false)

  const isMobile = useScreenSize()

  const navigate = useNavigate()

  return (
    <div className='w-full relative max-w-[1920px] mx-auto max-h-[600px] overflow-hidden'>
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
        <CarouselContent className='max-w-screen'>
          {images.map((img, i: number) => (
            <CarouselItem key={i}>
              <div className='relative overflow-hidden size-full'>
                <div className='absolute size-full top-0 left-0  z-20'></div>

                <img
                  src={isMobile ? img.src : img.srcSm }
                  alt={`img ${i + 1}`}
                  className='size-full max-h-[305px] sm:max-h-none object-cover'
                />

                <div className={cn('absolute top-1/2 -translate-y-1/2 flex flex-col gap-1 justify-center pl-10 w-1/2 z-30 sm:items-center xl:px-40',
                  img.textClasses,
                )}>
                  <p className='text-xs self-start text-red-500 font-semibold sm:text-xl'>{img.category}</p>

                  <h1 className='text-sm self-start leading-4 text-black font-bold sm:text-2xl sm:leading-tight sm:max-w-full xl:text-4xl 2xl:text-7xl'>
                    {img.title.toUpperCase()}
                  </h1>

                  <Button
                    size={isMobile ? 'xs' : 'lg'}
                    className='w-fit px-2 mt-2 sm:w-auto sm:self-start z-30'
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
                    <p className='text-[10px] font-bold text-white sm:text-sm xl:text-xl'>
                      {i === 0 && 'Explorar'}
                      {i === 1 && 'Ver colecciones'}
                      {i === 2 && 'Explorar'}
                    </p>

                    <ArrowRight className='size-3 2xl:size-5'/>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          isButtonShown={isButtonShown}
          className='text-primary hover:bg-primary'
        />
        <CarouselNext isButtonShown={isButtonShown} className='text-primary' />
      </Carousel>

    </div>
  )
}

export default MainCarousel
