import { Link } from 'react-router'

const BrandBadge = ({ brand }: { brand: string }) => {
  return (
    <div>
      <Link to={`/search?q=${brand}`}>
        <span className='bg-primary text-primary-foreground rounded text-xs p-1'>
          {brand}
        </span>
      </Link>
    </div>
  )
}

export default BrandBadge
