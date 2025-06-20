import { CATEGORIES } from '@/consts/productCategories'
import { Link } from 'react-router'

export const GroceryPromo = () => {
  return (
    <Link to={`/${CATEGORIES.COMESTIBLES.ORIGINAL}`}>
      <div className='flex items-center justify-between px-10 py-5 gradient-background max-h-32  rounded-xl overflow-hidden btn'>
        <p className='max-w-2/3 sm:text-xl font-extrabold text-gray-800'>
          PRODUCTOS DE CANASTA FAMILIAR
        </p>

        <img
          src='/img/grocery-prom.webp'
          alt='grocery category banner'
          className='size-50 sm:size-60'
        />
      </div>
    </Link>
  )
}

export const WatchesPromo = () => {
  return (
    <Link to={`/${CATEGORIES.RELOJES_PARA_HOMBRE.ORIGINAL}`}>
      <div className='flex items-center justify-between px-10 py-5 gradient-background rounded-xl max-h-32 overflow-hidden btn'>
        <p className='max-w-2/3 sm:text-xl font-extrabold text-gray-800'>
          NUEVA COLECCIÓN DE RELOJES
        </p>

        <img
          src='/img/smart-watch-prom.webp'
          alt='watches category banner'
          className='size-50 sm:size-60'
        />
      </div>
    </Link>
  )
}
