import { X } from 'lucide-react'
import { useState } from 'react'

const NoteBanner = () => {
  const bannerVisible =
    localStorage.getItem('banner') === 'false' ? false : true

  const [isVisible, setIsVisible] = useState(bannerVisible)

  if (isVisible) {
    return (
      <div className='flex justify-between px-4 py-1 text-center text-xs bg-mustard-primary md:px-10 md:text-sm'>
        <p className='w-[90%]'>
          Nota: el servidor puede tomar hasta 30 segundos en despertar de
          inactividad
        </p>

        <button
          onClick={() => {
            setIsVisible(false)
            localStorage.setItem('banner', 'false')
          }}
        >
          <X />
        </button>
      </div>
    )
  }
}

export default NoteBanner
