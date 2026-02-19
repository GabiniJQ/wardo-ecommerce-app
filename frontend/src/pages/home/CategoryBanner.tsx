import { CATEGORIES } from '@/consts/productCategories'
import { Link } from 'react-router'

interface Promotion {
  title: string
  imageUrl: string
  imageAlt: string
  categoryPath: string
}

const promotions: Promotion[] = [
  {
    title: 'PRODUCTOS DE CANASTA FAMILIAR',
    imageUrl: '/img/grocery-prom.webp',
    imageAlt: 'grocery category banner',
    categoryPath: CATEGORIES.COMESTIBLES.ORIGINAL,
  },
  {
    title: 'NUEVA COLECCIÓN DE RELOJES',
    imageUrl: '/img/smart-watch-prom.webp',
    imageAlt: 'watches category banner',
    categoryPath: CATEGORIES.RELOJES_PARA_HOMBRE.ORIGINAL,
  },
]

interface PromoCardProps {
  promotion: Promotion
}

const PromoCard = ({ promotion }: PromoCardProps) => {
  return (
    <Link to={`/${promotion.categoryPath}`}>
      <div className='flex items-center justify-between px-10 py-5 gradient-promo-card max-h-32 rounded-xl overflow-hidden btn'>
        <p className='max-w-2/3 text-base lg:text-xl font-extrabold text-white'>
          {promotion.title}
        </p>
        <img
          src={promotion.imageUrl}
          alt={promotion.imageAlt}
          className='size-50 sm:size-60'
        />
      </div>
    </Link>
  )
}

export const GroceryPromo = () => <PromoCard promotion={promotions[0]} />

export const WatchesPromo = () => <PromoCard promotion={promotions[1]} />
