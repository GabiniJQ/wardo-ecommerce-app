import { CATEGORIES } from '@/consts/productCategories'
import { NavigationMenuLink } from '@/shared/components/ui/navigation-menu'
import { cn } from '@/shared/utils/utils'
import { Link } from 'react-router'

const CategoryCardsMenu = ({ className, asChild }: { className?: string, asChild?: boolean }) => {
  const categories = Object.values(CATEGORIES)

  return (
    <ul className={cn('grid grid-cols-3 gap-2 w-[500px] sm:grid-cols-2 sm:gap-2', className)}>
      {categories.map((category) => {
        const href = `/${category.ORIGINAL}`
        return (
          <ListItem
            key={category.FORMATED}
            title={category.FORMATED}
            href={href}
            imgSrc={`/img/categories/${category.ORIGINAL}.webp`}
            asChild={asChild}
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
  asChild?: boolean
}

export const ListItem = ({ title, href, imgSrc, asChild }: ListItemProps) => {

  if (asChild) {
    return (
      <NavigationMenuLink className='gap-0 p-0 hover:bg-white'>
        <Link to={href} className='flex flex-col size-full bg-primary/10 border border-primary/10 rounded-xl transition-all last:hidden sm:flex-row sm:last:flex hover:bg-primary'>
          <div className='flex items-center justify-center p-2 h-2/3 sm:w-1/2 sm:h-full'>
            <img src={imgSrc} alt={title} className='object-contain max-h-16  sm:h-24 sm:max-h-none'/>
          </div>

          <div className='flex justify-center items-center p-2 bg-white rounded-b-xl h-1/3 sm:p-4 sm:w-1/2 sm:h-full sm:rounded-r-xl sm:rounded-l-none'>
            <p className='text-xs sm:text-sm font-semibold'>{title}</p>
          </div>
        </Link>
      </NavigationMenuLink>
    )
  } else {
    return (
      <Link to={href} className='flex flex-col size-full bg-primary/10 border border-primary/10 rounded-xl transition-all last:hidden sm:flex-row sm:last:flex hover:bg-primary'>
        <div className='flex items-center justify-center p-2 h-2/3 sm:w-1/2 sm:h-full'>
          <img src={imgSrc} alt={title} className='object-contain max-h-16  sm:h-24 sm:max-h-none'/>
        </div>

        <div className='flex justify-center items-center p-2 bg-white rounded-b-xl h-1/3 sm:p-4 sm:w-1/2 sm:h-full sm:rounded-r-xl sm:rounded-l-none'>
          <p className='text-xs sm:text-sm font-semibold'>{title}</p>
        </div>
      </Link>
    )
  }
  
}

export default CategoryCardsMenu
