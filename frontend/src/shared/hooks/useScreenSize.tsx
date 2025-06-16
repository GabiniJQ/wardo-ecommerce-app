import { useEffect, useState } from 'react'

const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  

  useEffect(() => {
    const resizeHandler = () => {
      setIsMobile(window.innerWidth < 640)
    }

    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  }, [])

  return isMobile
}

export default useScreenSize
