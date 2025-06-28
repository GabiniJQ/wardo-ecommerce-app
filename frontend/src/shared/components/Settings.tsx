import { RootState } from '@/app/store'
import { ROUTES } from '@/consts/routes'
import { Button } from '@/shared/components/ui/button'
import UnsignedCTA from '@/shared/components/UnsignedCTA'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { IoSettingsSharp } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

const Settings = () => {
  const [settingsOpen, setSettingsOpen] = useState(false)

  const { user } = useSelector((state: RootState) => state.auth)
  const userFirstName = user?.name.split(' ')[0]

  const menuItems = [
    { title: 'Mi cuenta', path: ROUTES.MY_ACCOUNT},
    { title: 'Mi carrito', path: ROUTES.CART},
  ]

  return (
    <div className='relative'>
      {/* Backdrop */}
      {settingsOpen &&
        createPortal(
          <div
            className='fixed inset-0 bg-black/50 z-10 '
            onClick={() => setSettingsOpen(false)}
          />,
          document.body // Sends backdrop to <body>
        )}

      {/* Button and Dropdown menu */}
      <div
        className='relative z-20 inline-block group'
        onMouseEnter={() => setSettingsOpen(true)}
        onMouseLeave={() => setSettingsOpen(false)}
      >
        <Button variant='border' className='cursor-pointer border-clean px-1 relative size-full '>
          <IoSettingsSharp className='size-10' />

          {/* Small triangle */}
          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 size-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white group-hover:hidden'></div>
        </Button>

        {/* Dropdown menu */}
        {settingsOpen && (
          <div className='absolute top-full left-1/2 transform -translate-x-1/2 z-50 flex flex-col bg-white pb-4 py-2 px-6 mt-3 min-w-[200px] shadow-2xl'>
            {/* Triangle */}
            <div className='absolute -top-2 left-1/2  -translate-x-1/2 size-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white'></div>

            {/* Spacer */}
            <div className='absolute -top-6 left-0 h-6 w-full '></div>

            <div className='w-full mx-auto border-b-[1px] py-2'>
              {!user && <UnsignedCTA />}
              {user && (
                <p className='text-black text-ellipsis line-clamp-1 max-w-[170px]'>Hola, {userFirstName}</p>
              )}
            </div>

            <div className='flex flex-col gap-1 my-6'>
              {menuItems.map((item) => (
                <Link to={item.path} key={item.title}>
                  <Button
                    key={item.title}
                    variant='link'
                    className='link text-black justify-start px-0'
                    onClick={() => setSettingsOpen(false)}
                  >
                    {item.title}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
