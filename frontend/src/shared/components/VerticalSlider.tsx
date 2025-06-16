'use client'
import { useEffect, useState } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { Product } from '@/shared/types/productTypes'

const VerticalSlider = ({
  direction = 'upwards',
  partition,
}: {
  direction?: 'upwards' | 'downwards'
  partition: number
}) => {
  const [products, setProducts] = useState([])
  const startIndex = partition * 10
  const endIndex = startIndex + 10

  // Get the products in the desired range
  const displayedProducts = products.slice(startIndex, endIndex)

  const ITEM_HEIGHT = 300 // Define a fixed height for each item
  const TOTAL_ITEMS = displayedProducts.length * 2 // Duplicated list for seamless loop
  const FULL_HEIGHT = ITEM_HEIGHT * TOTAL_ITEMS // Total height of the track
  const FAST_DURATION = 70
  const SLOW_DURATION = 90

  const isUpwards = direction === 'upwards' ? true : false
  const initialPosition = isUpwards ? 0 : -FULL_HEIGHT / 2
  const finalPosition = isUpwards ? -FULL_HEIGHT / 2 : 0

  const yTranslation = useMotionValue(initialPosition)
  const [mustFinish, setMustFinish] = useState(false)
  const [rerender, setRerender] = useState(false)
  const [duration, setDuration] = useState(FAST_DURATION)

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('https://fakestoreapi.com/products')
      const data = await res.json()
      setProducts(data)
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let controls

    if (mustFinish) {
      const position = yTranslation.get()
      const totalTravel = Math.abs(initialPosition - finalPosition)

      // Normalize progress
      const progress =
        totalTravel > 0 ? Math.abs(position - initialPosition) / totalTravel : 0
      const adjustedDuration = duration * (1 - progress)

      controls = animate(yTranslation, [position, finalPosition], {
        ease: 'linear',
        duration: adjustedDuration,
        onComplete: () => {
          setMustFinish(false)
          setRerender(!rerender)
        },
      })
    } else {
      controls = animate(yTranslation, [initialPosition, finalPosition], {
        ease: 'linear',
        duration: FAST_DURATION,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
      })
    }

    return controls.stop
  }, [
    yTranslation,
    finalPosition,
    initialPosition,
    duration,
    rerender,
    mustFinish,
  ])

  if (products.length === 0) {
    return <div className='text-center'>Loading...</div>
  }

  return (
    <div className='max-h-[1000px] overflow-hidden relative drop-shadow-lg'>
      <motion.div
        className='flex flex-col h-max'
        style={{ y: yTranslation }}
        onHoverStart={() => {
          setMustFinish(true)
          setDuration(SLOW_DURATION)
        }}
        onHoverEnd={() => {
          setMustFinish(true)
          setDuration(FAST_DURATION)
        }}
      >
        {/* Double product elements for loop effect */}
        {[...displayedProducts, ...displayedProducts].map(
          (product: Product, i) => (
            <div
              key={i}
              className={`h-[300px] w-[300px] flex flex-col items-center justify-center gap-2 bg-white border-b-2 border-b-gray-200 p-5`}
            >
              <div className='overflow-hidden'>
                <img src={product.images[0]} alt='' className='object-cover' />
              </div>
              <h1 className='text-sm font-semibold'>{product.title}</h1>
            </div>
          )
        )}
      </motion.div>
    </div>
  )
}

export default VerticalSlider
