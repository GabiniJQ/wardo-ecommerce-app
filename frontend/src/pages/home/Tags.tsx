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
    <div className='my-8 flex flex-wrap gap-2 px-2 md:px-20 md:gap-6'>
      {tags.map((tag, i) => (
        <li key={i} className='flex list-none separated-dash items-center gap-2 text-gray-300 last:after:content-none'>
          <Link to={`${ROUTES.SEARCH}?q=${tag}`}>
            <p className='text-xs text-gray-400'>{tag}</p>
          </Link>
        </li>
      ))}
    </div>
  )
}

export default Tags
