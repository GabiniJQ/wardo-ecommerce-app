import { CATEGORIES } from '@/consts/productCategories'
import { Link } from 'react-router'

const CategoryCardsMenu = () => {
  return (
    <ul className='grid grid-cols-2 gap-4 p-2 w-[500px]'>
      {Object.values(CATEGORIES).map((category) => {
        const href = `/${category.ORIGINAL}`
        return (
          <ListItem
            key={category.FORMATED}
            title={category.FORMATED}
            href={href}
            imgSrc={`/img/categories/${category.ORIGINAL}.webp`}
          />
        )
      })}
    </ul>
  )
}

type ListItemProps = {
  title: string
  href: string
  imgSrc: string
  description?: string
}

export const ListItem = ({ title, href, imgSrc }: ListItemProps) => {
  return (
    <Link to={href} className='flex w-full gap-2 border rounded-xl'>
      <div className='flex items-center justify-center gap-2 border-r-2 p-4 w-1/2 bg-accent rounded-l-xl shrink-0'>
        <img src={imgSrc} alt={title} className='object-contain w-16 h-16 md:w-20 md:h-20'/>
      </div>

      <div className='flex justify-center items-center p-4 w-1/2 flex-grow'>
        <p className=' font-semibold'>{title}</p>
      </div>
    </Link>
  )
}

export default CategoryCardsMenu
