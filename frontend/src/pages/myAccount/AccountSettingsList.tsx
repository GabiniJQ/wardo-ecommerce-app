import { RootState } from '@/app/store'
import { ROUTES } from '@/consts/routes'
import { AccountSetting, AccountSettingDescription, AccountSettingIcon } from '@/pages/myAccount/AccountSetting'
import { useEffect } from 'react'
import { HiLocationMarker, HiOutlineTruck, HiOutlineUserCircle } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const AccountSettingsList = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const { isChecked } = useSelector((state: RootState) => state.auth.checkAuth)
  const navigate = useNavigate()

  useEffect(() => {
    if (isChecked && !user?._id) {
      navigate('/login')
    }
  }, [user, navigate, isChecked])

  return (
    <div className='flex flex-col gap-4 md:grid md:grid-cols-2'>
      {/* Account data */}
      <AccountSetting path={`${ROUTES.ACCOUNT_INFO}`}>
        <AccountSettingIcon>
          <HiOutlineUserCircle className='size-8 text-primary'/>
        </AccountSettingIcon>

        <AccountSettingDescription
          title='Datos de la cuenta'
          description='Información sobre tus credenciales para ingresar a Wardo e información personal'
        />
      </AccountSetting>

      {/* Orders */}
      <AccountSetting path={`${ROUTES.ORDERS}`}>
        <AccountSettingIcon>
          <HiOutlineTruck className='size-8 text-primary'/>
        </AccountSettingIcon>

        <AccountSettingDescription
          title='Pedidos'
          description='Información sobre tus pedidos realizados y en camino'
        />
      </AccountSetting>
      
      {/* Addresses */}
      <AccountSetting path={`${ROUTES.ADDRESSES}`}>
        <AccountSettingIcon>
          <HiOutlineUserCircle className='size-8 text-primary'/>
        </AccountSettingIcon>

        <AccountSettingDescription
          title='Direcciones'
          description='Direcciones guardadas en tu cuenta'
        />
      </AccountSetting>

      {/* Cards */}
      <AccountSetting path={`${ROUTES.CARDS}`}>
        <AccountSettingIcon>
          <HiLocationMarker className='size-8 text-primary'/>
        </AccountSettingIcon>

        <AccountSettingDescription
          title='Tarjetas'
          description='Tarjetas guardadas en tu cuenta'
        />
      </AccountSetting>
    </div>
  )
}

export default AccountSettingsList
