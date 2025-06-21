import { ROUTES } from '@/consts/routes'
import { Link } from 'react-router'

const tags = [
  'Moda',
  'Decoración del Hogar',
  'Belleza',
  'Utensilios de Cocina',
  'Portátiles',
  'Relojes',
  'Accesorios',
  'Mascotas',
]

const Tags = () => {
  return (
    <div className='my-8 flex flex-wrap  gap-4 rounded sm:px-10 xl:justify-center '>
      {tags.map((tag, i) => (
        <li key={i} className='flex list-none separated-dash items-center gap-5 after:text-gray-300 last:after:content-none'>
          <Link 
            to={`${ROUTES.SEARCH}?q=${tag}`}
            className='sm:bg-primary/70 sm:px-4 sm:py-2 sm:rounded-full sm:hover:bg-primary/40'
          >
            <p className='text-xs text-gray-400 sm:text-white'>{tag}</p>
          </Link>
        </li>
      ))}
    </div>
  )
}

export default Tags
