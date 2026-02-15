import { RootState } from '@/app/store'
import { Address } from '@/shared/types/authTypes'
import { createSelector } from '@reduxjs/toolkit'

export const selectMainAddress = createSelector(
  [(state: RootState) => state.auth.user?.addresses],
  (addresses: Address[] | undefined) => {
    const mainAdress = addresses?.find((address) => address.isMain)
    return mainAdress
  },
)
