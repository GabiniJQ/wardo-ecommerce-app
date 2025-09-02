import ProductRating from '@/shared/components/ProductRating'
import { AppDispatch } from '@/app/store'
import { fetchProductById } from '@/features/products/productsSlice'
import { formatCategoryText, formattedPrice } from '@/shared/utils/utils'
import ImagesCarousel from '@/pages/product/ImagesCarousel'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router'
import Review from '@/pages/product/Review'
import BrandBadge from '@/shared/components/BrandBadge'
import useScreenSize from '@/shared/hooks/useScreenSize'
import { selectProductById } from '@/features/products/productSelectors'
import ProductNotFound from '@/pages/notFound/ProductNotFound'
import Quantity from '@/shared/components/Quantity'
import BuyingOptions from '@/shared/components/BuyingOptions'
import { CONVERSION_RATE } from '@/consts/conversionRate'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/shared/components/ui/breadcrumb'

const ProductPage = () => {
  const { id } = useParams<{ id: string }>()

  // Dispatch functions
  const dispatch = useDispatch<AppDispatch>()

  const selector = useMemo(() => selectProductById(id!), [id])
  const { product, isLoading } = useSelector(selector)

  // ID 24 character validation
  const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id)

  useEffect(() => {
    if (!id || !isValidObjectId(id)) return

    if (id && !product) {
      dispatch(fetchProductById(id))
    }
  }, [dispatch, id, product])

  // Mobile hook
  const isMobile = useScreenSize()

  // Selected Product Quantity
  const [quantity, setQuantity] = useState(1)

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (!product) {
    return <ProductNotFound />
  }

  // Destructure product(state) properties
  const {
    title,
    description,
    category,
    price,
    discountPercentage,
    stock,
    brand,
    images,
    rating,
    reviews,
    shippingInformation,
  } = product

  const ratingFixed = Math.floor(Number((rating * 10).toFixed(8))) / 10
  const lowStock = stock < 20

  // Price with discount
   const finalPrice = price - (price * discountPercentage) / 100

  // COP Simulated conversion
  const priceCOP = Number((price * CONVERSION_RATE.COP).toFixed(0)) // Line-through price
  const finalPriceCOP = Number((finalPrice * CONVERSION_RATE.COP).toFixed(0))

  if (!id) return <ProductNotFound />
  return (
    <div className='p-4 md:mx-32 bg-white lg:mx-0 lg:py-14 lg:px-0 lg:flex lg:flex-col lg:gap-4  2xl:mx-40'>
      {/* Back button and Category */}
      <div className='flex items-center gap-2'>
        <Breadcrumb className='text-primary'>
          <BreadcrumbList className='text-primary'>
            <BreadcrumbItem>
              <Link to='/'>Inicio</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to={`/search?q=${category}`}>
                {formatCategoryText(category)}
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

      </div>

      {/* Outer container */}
      <div className='w-full bg-white lg:flex lg:gap-4 lg:p-4 rounded-lg'>
        <div className='lg:w-2/4 lg:h-full'>
          {isMobile && (
            <div>
              {/* Title */}
              <div className='flex  items-center'>
                <h1 className='title'>{title}</h1>
              </div>

              <BrandBadge brand={brand} />
            </div>
          )}

          {/* Images Carousel */}
          <div className='flex justify-center items-center w-full lg:h-full'>
            <ImagesCarousel
              images={images}
              className='size-full'
            />
          </div>
        </div>
        
        {/* Rightside container */}
        <div className='lg:flex lg:flex-col lg:w-2/4 lg:gap-10'>
          <div >
            {!isMobile && (
              // Title DESKTOP
              <div>
                <div>
                  <h1 className='title'>{title}</h1>
                </div>

                <BrandBadge brand={brand} className='w-fit'/>
              </div>
            )}
          </div>

          {/* Product descriptions & buy info */}
          <div>
            <div className='lg:flex'>
              <div className='lg:w-1/2 lg:flex lg:flex-col lg:gap-6 lg:p-2'>
                {/* Product Rating */}
                <div className='flex items-center gap-1 h-8'>
                  <p>{ratingFixed}</p>
                  
                  <ProductRating rating={rating} />
                  
                  <p>({reviews.length})</p>
                </div>

                {/* Price */}
                <div className='flex flex-col gap-2 mt-6 lg:mt-0'>
                  <p className='line-through'>{formattedPrice(priceCOP)}</p>

                  <div className='flex gap-4 items-center lg:gap-0 lg:flex-col lg:items-start xl:flex-row xl:items-center xl:gap-4'>
                    <h3 className='text-4xl font-semibold'>{formattedPrice(finalPriceCOP)}</h3>

                    <p className='text-green-500'>{discountPercentage.toFixed(0)}% OFF</p>
                  </div>
                </div>

                {/* Product features/description */}
                {!isMobile && (
                  <div className='flex flex-col gap-2'>
                    <h4 className='text-lg font-semibold'>Información del producto</h4>

                    <p>{description}</p>
                  </div>
                )}
              </div>
              
              {/* Buying container */}
              <div className='flex flex-col gap-6 mt-10 lg:w-1/2 lg:mt-0 lg:p-2'>
                <div className='flex flex-col gap-3'>
                  <Quantity defaultValue={1} onChange={setQuantity} stock={stock}/>

                  {lowStock && <p className='text-red-400'>Sólo quedan {stock} unidades en stock</p>}

                  <BuyingOptions productId={id} quantity={quantity} stock={stock}/>
                </div>

                <div className='flex gap-4 lg:flex-col'>
                  <div className='w-1/2 p-4 lg:w-full'>
                    <h4 className='text-lg font-semibold'>Envío a nivel nacional</h4>
                    <p>{shippingInformation}</p>
                  </div>

                  {/* Payment methods */}
                  <div className='flex flex-col gap-2 bg-accent p-4 rounded'>
                    <h4 className='text-lg font-semibold'>Métodos de pago</h4>

                    <div className='flex gap-2'>
                      <div className='size-10'>
                        <img src='/img/logo-pse.png' className='size-full'/>
                      </div>

                      <div className='size-10'>
                        <img src='/img/logo-skrill.png' className='size-full'/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product features/description */}
                {isMobile && (
                  <div className='flex flex-col gap-2'>
                    <h4 className='text-lg font-semibold'>Información del producto</h4>

                    <p>{description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews section */}
      <div className='flex flex-col gap-4 mt-10 lg:p-4 lg:justify-center lg:mt-10 lg:gap-10 bg-white rounded-lg'>
        <h4 className='text-lg font-semibold lg:text-center lg:text-3xl'>Reseñas de usuarios</h4>

        <div className='flex flex-col gap-4 lg:flex-row lg:justify-evenly lg:gap-10'>
          {reviews.map((review) => <Review review={review} key={`${review.reviewerEmail}.${review.date}`} />)}
        </div>
      </div>
    </div>
  )
}

export default ProductPage
