import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { useState } from 'react'

const images = [
  'https://images.unsplash.com/photo-1542992015-4a0b729b1385?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1572584642822-6f8de0243c93?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1546502208-81d149d52bd7?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]

const MainCarousel = () => {
  const [isAutoplaying, setIsAutoplaying] = useState<boolean | null>(true)
  const [isButtonShown, setIsButtonShown] = useState<boolean | null>(false)
  

  return (
    <div className='w-full relative max-w-[1920px] mx-auto'>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2500,
          }),
        ]}
        opts={{ loop: true }}
        className='w-full h-[400px]'
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
        <CarouselContent>
          {images.map((img: string, i: number) => (
            <CarouselItem key={i}>
              <div className='w-full h-[400px] overflow-hidden'>
                <img src={img} alt={`img ${i + 1}`} className='size-full object-cover' />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious isButtonShown={isButtonShown} />
        <CarouselNext isButtonShown={isButtonShown} />
      </Carousel>

      {/* Blur Gradient */}
      <div className='absolute h-20 w-full gradient-blur-bottom -bottom-2'></div>
    </div>
  )
}

export default MainCarousel
