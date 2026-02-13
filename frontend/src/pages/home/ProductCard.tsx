import { Button } from '@/shared/components/ui/button'
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
      <div className={cn('group relative flex flex-col btn px-2', className)}>
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

  const { title, price, discountedPrice } = product

  return (
    <div className={cn('flex justify-between sm:flex-col', className)}>
      <div className=''>
        <div className='line-clamp-2'>
          <p className='group-hover:text-primary text-sm sm:text-base min-h-10'>{title}</p>
        </div>

        {/* Original Price */}
        <div>
          <p className='line-through text-xs mt-2 mb-0 text-gray-500'>
            {formattedPrice(price)}
          </p>
        </div>

        {/* Price with discount */}
        <div>
          <p className='text-base sm:text-lg font-semibold mt-0'>{formattedPrice(discountedPrice)}</p>
        </div>
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

type ProductCardOffTagProps = {
  className?: string
}

export const ProductCardOffTag = ({ className }:ProductCardOffTagProps) => {
  const { product } = useProductCard()

  if (!product) return

  const { discountPercentage } = product

  return (
    <div className={cn('', className)}>
      <span className='flex items-center justify-center bg-red-400 px-2 py-3 rounded-full text-white text-xs text-center leading-0'>
        -{discountPercentage.toFixed(0)}%
      </span>
    </div>
  )
}