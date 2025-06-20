import {
  ProductCard,
  ProductCardImage,
  ProductCardInfo,
} from '@/pages/home/ProductCard'
import BuyingOptions from '@/shared/components/BuyingOptions'
import ProductRating from '@/shared/components/ProductRating'
import { Product } from '@/shared/types/productTypes'
import { formatCategoryURL } from '@/shared/utils/utils'
import { Link } from 'react-router'

const ProductCardDetailed = ({ product }: { product: Product }) => {
  const {
    rating,
    reviews,
    description,
    shippingInformation,
    _id,
    stock,
    category,
    slug,
  } = product

  const productLink = `/${formatCategoryURL(category)}/${slug}/${_id}`
  return (
    <ProductCard
      key={_id}
      product={product}
      className='flex-row p-2 size-full shadow rounded lg:flex-col'
    >
      <Link
        to={productLink}
        className='flex justify-center items-center bg-gray-100 w-1/2 lg:w-full'
      >
        <ProductCardImage />
      </Link>

      <div className='flex flex-col justify-between gap-4 px-2 w-1/2 lg:w-full'>
        {/* Rating stars */}
        <Link to={productLink} className='flex flex-col justify-between gap-4'>
          <div className='flex gap-2'>
            <p className='text-sm'>{rating}</p>
            <ProductRating rating={rating} />
            <p className='text-sm'>({reviews.length})</p>
          </div>

          <ProductCardInfo className='text-xl' />

          {/* Description */}
          <p className='text-sm text-gray-700 line-clamp-4'>{description}</p>

          <div className='flex flex-col gap-1'>
            <h4 className='font-semibold text-sm'>Envío a nivel nacional</h4>
            <p className='text-xs'>{shippingInformation}</p>
          </div>
        </Link>

        <BuyingOptions productId={_id} quantity={1} stock={stock} />
      </div>
    </ProductCard>
  )
}

export default ProductCardDetailed
