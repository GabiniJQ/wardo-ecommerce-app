import { ROUTES } from '@/consts/routes'
import { Link } from 'react-router'

const tags = [
  'Electrónica',
  'Moda',
  'Decoración del Hogar',
  'Belleza',
  'Fitness',
  'Juguetes',
  'Libros',
  'Videojuegos',
  'Utensilios de Cocina',
  'Equipo para Exteriores',
  'Smartphones',
  'Portátiles',
  'Relojes',
  'Zapatos',
  'Accesorios',
  'Muebles',
  'Cuidado de la Piel',
  'Equipo Deportivo',
  'Cámaras',
  'Mascotas',
]

const Tags = () => {
  return (
    <div className='my-8 flex flex-wrap sm:px-10 gap-4 rounded'>
      {tags.map((tag, i) => (
        <li key={i} className='flex list-none separated-dash items-center gap-5 after:text-gray-300 last:after:content-none'>
          <Link 
            to={`${ROUTES.SEARCH}?q=${tag}`}
            className='sm:bg-primary/70 sm:px-4 sm:py-2 sm:rounded-full sm:hover:bg-primary/40'
          >
            <p className='text-xs text-gray-300 sm:text-white'>{tag}</p>
          </Link>
        </li>
      ))}
    </div>
  )
}

export default Tags
