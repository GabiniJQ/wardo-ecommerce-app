import { RootState } from '@/app/store'
import { ROUTES } from '@/consts/routes'
import { AccountSetting, AccountSettingDescription, AccountSettingIcon } from '@/pages/myAccount/AccountSetting'
import { useEffect } from 'react'
import { HiOutlineLocationMarker, HiOutlineUserCircle } from 'react-icons/hi'
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
    <div className='grid gap-4 lg:grid-cols-3 xl:grid-cols-4'>
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

      {/* Addresses */}
      <AccountSetting path={`${ROUTES.ADDRESSES}`}>
        <AccountSettingIcon>
          <HiOutlineLocationMarker className='size-8 text-primary'/>
        </AccountSettingIcon>

        <AccountSettingDescription
          title='Direcciones'
          description='Direcciones guardadas en tu cuenta'
        />
      </AccountSetting>

    </div>
  )
}

export default AccountSettingsList
