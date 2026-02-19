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

const images = [
  {
    title: 'Lo mejor en tecnología -50% de descuento',
    textClasses: '',
    src: '/img/car01.webp',
    srcSm: '/img/car01_short.webp',
    category: 'Portátiles y computadores',
  },
  {
    title: 'Colecciones de moda del 2026',
    textClasses: '',
    src: '/img/car0.webp',
    srcSm: '/img/car0_short.webp',
    category: 'Ropa de moda',
  },
  {
    title: 'Productos únicos para tu hogar',
    textClasses: '',
    src: '/img/car02.webp',
    srcSm: '/img/car02_short.webp',
    category: 'Decoración de hogar',
  },
]


const MainCarousel = () => {
  const [isAutoplaying, setIsAutoplaying] = useState<boolean | null>(true)
  const [isButtonShown, setIsButtonShown] = useState<boolean | null>(false)

  const isMobile = useScreenSize()

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
                  src={!isMobile ? img.src : img.srcSm}
                  alt={`img ${i + 1}`}
                  className='size-full object-cover'
                />
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
