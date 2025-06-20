import { Button } from '@/shared/components/ui/button'
import { CONVERSION_RATE } from '@/consts/conversionRate'
import { ProductCardContext, useProductCard } from '@/shared/contexts/productCardContext'
import {
  formattedPrice,
  cn
} from '@/shared/utils/utils'
import { Product } from '@/shared/types/productTypes'
import { ReactNode } from 'react'

type ProductCardProps = {
  children: ReactNode
  product: Product
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export const ProductCard = ({
  children, product, className, ...props
}: ProductCardProps) => {
  return (
    <ProductCardContext.Provider value={{ product }} {...props}>
      <div className={cn('group flex flex-col btn px-2', className)}>
        {children}
      </div>
    </ProductCardContext.Provider>
  )
}

export const ProductCardImage = ({ className }: { className?: string }) => {
  const { product } = useProductCard()
  
  if (!product) return

  const { images, title } = product
  const mainImage = images[0]
  return (
    <div
      className={cn(' overflow-hidden self-center transition-transform duration-300 md:group-hover:-translate-y-2',
        className)}
    >
      <img
        src={mainImage}
        alt={`${title}`}
        className='size-full object-contain'
      />
    </div>
  )
}

export const ProductCardInfo = ({ className }: { className?: string }) => {
  const { product } = useProductCard()

  if (!product) return

  const { title, price, discountPercentage } = product
  const finalPrice = price - (price * discountPercentage) / 100

  // COP Simulated conversion
  const priceCOP = Number((price * CONVERSION_RATE.COP).toFixed(0))
  const finalPriceCOP = Number((finalPrice * CONVERSION_RATE.COP).toFixed(0))

  return (
    <div className={cn('flex flex-col', className)}>
      <div className='line-clamp-2'>
        <p className='group-hover:text-primary'>{title}</p>
      </div>

      {/* Discount */}
      <div>
        <p className='line-through text-[0.65rem] mt-2 mb-0'>
          {formattedPrice(priceCOP)}
        </p>
      </div>

      {/* Price */}
      <div>
        <p className='text-lg font-semibold mt-0'>{formattedPrice(finalPriceCOP)}</p>
      </div>

      <div className='bg-red-400 transform skew-x-12 w-16'>
        <p className='text-white text-[0.6rem] text-center '>
          Ahorras {discountPercentage.toFixed(0)}%
        </p>
      </div>
    </div>
  )
}

export const ProductCardButton = ({ children, className, ...props }: {
  children: ReactNode, className?: string} & React.ComponentProps<"button">
) => {
  return (
    <Button
      className={cn('btn', className)}
      {...props}
    >
      {children}
    </Button>
  )
}