import { Button } from '@/shared/components/ui/button'
import { 
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  CarouselItem,
  type CarouselApi,
} from '@/shared/components/ui/carousel'
import { useEffect, useState } from 'react'

type ImagesCarouselProps = {
  images: string[]
  className?: string
}

const ImagesCarousel = ({ images, className }: ImagesCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])
  return (
    <div className={`${className ?? ''}`}>
      <Carousel setApi={setApi}>
        {/* Slide counter */}
        <div className='flex justify-center'>
          <Button className='px-2 rounded-sm' variant='secondary'>{current} / {count}</Button>
        </div>

        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image} className='flex justify-center items-center'>
              <div className='flex justify-center items-center size-3/4'>
                <img src={image} className='size-full object-scale-down'/>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext isButtonShown={true} />
        <CarouselPrevious isButtonShown={true} />
        
      </Carousel>
    </div>
  )
}

export default ImagesCarousel
