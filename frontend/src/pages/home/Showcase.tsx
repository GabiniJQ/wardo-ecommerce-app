import { AppDispatch, RootState } from '@/app/store'
import BrandBadge from '@/shared/components/BrandBadge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { fetchShowcaseResults } from '@/features/products/productsSlice'
import { Product } from '@/shared/types/productTypes'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'

type ShowcaseProps = {
  brand: string
  phrase: string
}

const Showcase = ({ brand, phrase }: ShowcaseProps) => {
  const showcaseData = useSelector((state: RootState) => state.products.filteredResults.showcase[brand])
  
  const { products = [], isLoading = false, isError = false } = showcaseData || {}
  const mainProduct = products[0]
  const secondaryProducts = products.slice(1)

  const images = products.map((product) => product.images[0]) 
  const mainImage = images[0]
  const secondaryImages = images.slice(1)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const filters = {
      brands: brand,
      limit: 5,
    }

    dispatch(fetchShowcaseResults(filters))
  }, [dispatch, brand])

  if (products.length === 0 || isLoading || isError) {
    return (
      <div className='showcase bg-white min-h-[500px] w-full p-4 rounded-2xl border shadow-sm'>
        <Skeleton className='h-3/4 w-full' />

        <div className='flex items-center justify-center gap-2 h-1/4 bg-white p-4'>
          <Skeleton className='size-full' />
          <Skeleton className='size-full' />
          <Skeleton className='size-full' />
          <Skeleton className='size-full' />
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-min p-4 rounded-2xl border shadow-sm bg-white '>  
      <div className='relative flex flex-col gap-1'>
        <h3 className='font-medium line-clamp-2 min-h-[50px]'>{phrase}</h3>
        
        <div className='relative w-full'>
          <BrandBadge brand={brand}/>
        </div>
      </div>

      <div className='flex items-center justify-center h-3/5'>
        <ShowcaseMainItem image={mainImage} product={mainProduct} />
      </div>

      <div className='flex items-center justify-between size-full h-1/5 bg-accent rounded md:px-6 xl:px-0'>
        <div className='flex justify-evenly items-center gap-2 size-full p-2'>
          {secondaryImages.map((image, i) => 
            <ShowcaseSecondaryItem
              image={image}
              product={secondaryProducts[i]}
              key={image}
            />
          )}
        </div>
      </div>
    </div>
  )
}

type ShowcaseMainItemProps = {
  image: string
  product: Product
}

const ShowcaseMainItem = ({ image, product }: ShowcaseMainItemProps) => {
  const { category, slug, _id } = product
  return (
    <Link to={`/${category}/${slug}/${_id}`} className='size-full flex items-center justify-center'>
      <div className='h-full overflow-hidden cursor-pointer'>
        <img
          src={image}
          alt='Product'
          className={'w-full h-full object-cover hover:scale-110 transition'}
          />
      </div>
    </Link>
  )
}

type ShowcaseSecondaryItemProps = { image: string, product: Product }

const ShowcaseSecondaryItem = ({ image, product }: ShowcaseSecondaryItemProps) => {
  const { category, slug, _id } = product
  return (
    <Link
      to={`/${category}/${slug}/${_id}`}
      className='flex items-center justify-center size-full bg-white border-2 border-transparent hover:border-2 hover:border-blue-primary'
    >
      <div className='h-full   cursor-pointer'>
        <img className='size-full object-cover' src={image} alt='' />
      </div>
    </Link>
  )
}

export default Showcase
