const CategoryItem = ({
  children,
  isParent,
}: {
  children: React.ReactNode
  isParent: boolean
}) => {

  return (
    <li className='text-sm p-2 rounded hover:bg-accent cursor-pointer '>
      {children}
      {isParent && <span className='ml-2 font-bold'>&gt;</span>}
    </li>
  )
}

export default CategoryItem
