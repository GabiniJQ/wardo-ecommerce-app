import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '@/features/auth/authService'
import { Address, AuthState, ChangePassReject, LoginData, UserData } from '@/shared/types/authTypes'
import { AxiosError } from 'axios'
import { formatUserLocalStorage, getErrorMessage } from '@/shared/utils/utils'
import { isEqual } from 'lodash'
import api from '@/lib/axios'
import { RootState } from '@/app/store'
import { setCart, showMergeDialog } from '@/features/cart/cartSlice'

const storedUser = localStorage.getItem('user')

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  login: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  checkAuth: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    isChecked: false,
    message: '',
  },
  register: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  verifyEmail: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  logout: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
  },
  forgotPassword: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    sentEmail: '',
  },
  resetPassword: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  checkPasswordToken: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  changeName: {
    isLoading: false,
    isError: false,
    isSuccess: false,
  },
  changePassword: {
    isLoading: false,
    isSuccess: false,
    errorMessage: '',
    errorCode: '',
  },
  changeAddress: {
    isLoading: false,
    isError: false,
    isSuccess: false,
  },
  changeMainAddress: {
    isLoading: false,
    isError: false,
    isSuccess: false,
  },
  deleteAddress: {
    isLoading: false,
    isError: false,
    isSuccess: false,
  },
  addAddress: {
    isLoading: false,
    isError: false,
    isSuccess: false,
  },
  justRegistered: sessionStorage.getItem('justRegistered') === 'true',
}

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (user: UserData, { rejectWithValue }) => {
    try {
      return await authService.register(user)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Verify email
export const verifyEmail = createAsyncThunk('auth/verifyEmail', 
  async (code: string, { rejectWithValue }) => {
    try {
      return await authService.verifyEmail(code)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
})

// Check user authentication
export const checkAuth = createAsyncThunk('auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.checkAuth()
    } catch (error) {
      let message = 'Algo no salió como esperabamos...'

      if (error instanceof AxiosError) {
        message = error.response?.data.message || error.message
      } else if (error instanceof Error) {
        message = error.message
      }
      return rejectWithValue(message)
    }
  }
)

// User login
export const login = createAsyncThunk('auth/login',
  async (userData: LoginData, 
    { rejectWithValue, dispatch, getState }) => {
      try {
        const res = await authService.login(userData)

        // Merge Guest and DB Carts logic
        const cartRes = await api.get(`/cart/${res.user._id}`)
        const userCart = cartRes.data.items
        const state = getState() as RootState

        if (state.cart.items.length > 0 && userCart.length > 0) {
          dispatch(showMergeDialog(state.cart.items))
        } else if (userCart.length > 0) {
          dispatch(setCart(userCart))
        }

        return res
      } catch (error) {
        return rejectWithValue(getErrorMessage(error))
      }
  }
)

// User logout
export const logout = createAsyncThunk('auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.logout()
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Send recovery password mail
export const forgotPassword = createAsyncThunk('auth/forgotPassword',
  async ( email: string, { rejectWithValue }) => {
    try {
      const res = await api.post('/users/forgot-password', { email })
      const message = res.data.message as string
      const resEmail = res.data.email as string
      return { message, email: resEmail}
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Reset password
type ResetPasswordType = {
  password: string
  token: string
}

export const resetPassword = createAsyncThunk('auth/resetPassword',
  async ( { password, token }: ResetPasswordType, { rejectWithValue }) => {
    try {
      const res = await api.post(`/users/reset-password/${token}`, { password })
      const message = res.data.message as string
      return { message }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Check reset password token
export const checkResetPasswordToken = createAsyncThunk(
  'auth/checkResetPasswordToken', async (
    token: string, { rejectWithValue }
  ) => {
    try {
      const res = await api.get(`/users/check-password-token/${token}`)

      return res.data.message as string
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// User name change in account settings
export const changeName = createAsyncThunk('auth/changeName',
  async ({ newName, userId }: { newName: string, userId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(
        `/users/change-name/${userId}`, { name: newName }
      )

      const name = res.data.name as string
      return { name }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// User password change in account settings
export const changePassword = createAsyncThunk('auth/changePassword',
  async ({ userId, passData }:{
    userId: string
    passData: {
      newPass: string
      currentPass: string
    }, 
  },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(
        `/users/change-password/${userId}`, passData
      )

      const message = res.data.message as string
      return { message }
    } catch (error) {
      const errorPayload = {
        message: 'Algo no salió como esperabamos...',
        errorCode: '',
      }
    
      if (error instanceof AxiosError) {
        errorPayload.message = error.response?.data.message || error.message
        errorPayload.errorCode = error.response?.data?.errorCode
      } else if (error instanceof Error) {
        errorPayload.message = error.message
      }
      return rejectWithValue(errorPayload)
    }
  }
)

type ChangeAddressData = Omit<Address, 'isMain'>
// Change Address
export const changeAddress = createAsyncThunk('auth/changeAddress',
  async ({ userId, address }: {
    userId: string, address: ChangeAddressData
  }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/users/change-address/${userId}`, address)
      const newAddresses = res.data.addresses as Address[]
      console.log('res :', newAddresses)
      
      return { newAddresses }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const changeMainAddress = createAsyncThunk(
  'auth/changeMainAddress',
  async ({ userId, newMainId }: { userId: string; newMainId: string }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/users/change-main-address/${userId}`, { newMainId })
      return { newAddresses: res.data.addresses }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)


// Delete Address
export const deleteAddress = createAsyncThunk('auth/deleteAddress',
  async ({ userId, addressId }: {
    userId: string, addressId: string
  }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/users/address/${userId}/${addressId}`)
      const addresses: Address[] = res.data.addresses
      
      return { addresses }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

type AddAddressData = Omit<Address, '_id' | 'isMain'>
// Add Address
export const addAddress = createAsyncThunk('auth/addAddress',
  async ({ userId, address }: {
    userId: string, address: AddAddressData
  }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/users/address/${userId}`, address)
      const addresses: Address[] = res.data.addresses
      
      return { addresses }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetLogin: (state) => {
      state.login.isLoading = false
      state.login.isError = false
      state.login.isSuccess = false
      state.login.message = ''
    },
    resetCheckAuth: (state) => {
      state.checkAuth.isLoading = false
      state.checkAuth.isError = false
      state.checkAuth.isSuccess = false
      state.checkAuth.message = ''
    },
    resetRegister: (state) => {
      state.register.isLoading = false
      state.register.isError = false
      state.register.isSuccess = false
      state.register.message = ''
    },
    resetVerifyEmail: (state) => {
      state.register.isLoading = false
      state.register.isError = false
      state.register.isSuccess = false
      state.register.message = ''
    },
    resetJustRegistered: (state) => {
      state.justRegistered = false
      sessionStorage.removeItem('justRegistered')
    },
    resetAddAddress: (state) => {
      state.addAddress.isSuccess = false
    },
    resetForgotPassword: (state) => {
      state.forgotPassword.isSuccess = false
      state.forgotPassword.isError = false
    },
    resetCheckPasswordToken: (state) => {
      state.checkPasswordToken.isError = false
      state.checkPasswordToken.isSuccess = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.register.isLoading = true
      })
      .addCase(register.fulfilled, (state) => {
        state.register.isLoading = false
        state.register.isSuccess = true
        state.justRegistered = true
        sessionStorage.setItem('justRegistered', 'true')
      })
      .addCase(register.rejected, (state, action) => {
        state.register.isLoading = false
        state.register.isError = true
        state.register.message = action.payload as string
        state.user = null
      })
      .addCase(verifyEmail.pending, (state) => {
        state.verifyEmail.isLoading = true
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.verifyEmail.isLoading = false
        state.verifyEmail.isSuccess = true
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verifyEmail.isLoading = false
        state.verifyEmail.isError = true
        state.verifyEmail.message = action.payload as string
        state.user = null
      })
      .addCase(checkAuth.pending, (state) => {
        state.checkAuth.isLoading = true
        state.checkAuth.isError = false
      }) 
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (!isEqual(state.user, action.payload.user)) {
          state.checkAuth.isLoading = false
          state.checkAuth.isSuccess = true
          state.checkAuth.isChecked = true
          state.user = action.payload.user
          localStorage.setItem('user', JSON.stringify(
            formatUserLocalStorage(action.payload.user)
          ))
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.checkAuth.isLoading = false
        state.checkAuth.isError = true
        state.checkAuth.isChecked = true
        state.checkAuth.message = action.payload as string
        state.user = null
        localStorage.removeItem('user')
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem('user')
        state.logout.isLoading = false
        state.logout.isSuccess = true
        state.logout.isError = false
        state.user = null
      })
      .addCase(logout.rejected, (state) => {
        state.logout.isLoading = false
        state.logout.isError = true
        state.logout.isSuccess = false
        state.user = null
      })
      .addCase(login.pending, (state) => {
        state.login.isLoading = true
        state.login.isSuccess = false
        state.login.isError = false
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login.isLoading = false
        state.login.isSuccess = true
        state.login.isError = false
        state.user = action.payload.user
        localStorage.setItem('user', JSON.stringify(
          formatUserLocalStorage(action.payload.user)
        ))
      })
      .addCase(login.rejected, (state, action) => {
        state.login.isLoading = false
        state.login.isError = true
        state.login.message = action.payload as string
        state.user = null
      })
      .addCase(changeName.pending, (state) => {
        state.changeName.isLoading = true
        state.changeName.isError = false
        state.changeName.isSuccess = false
      })
      .addCase(changeName.fulfilled, (state, action) => {
        if (action.payload && state.user) {
          state.changeName.isLoading = false
          state.changeName.isError = false
          state.changeName.isSuccess = true

          const { name } = action.payload
          state.user.name = name

          const localUser = JSON.parse(localStorage.getItem('user') || '')
  
          if (localUser.length > 1) {
            localUser.name = name

            localStorage.setItem('user', JSON.stringify(
              formatUserLocalStorage(localUser)
            ))
          }
        }
      })
      .addCase(changeName.rejected, (state) => {
        state.changeName.isLoading = false
        state.changeName.isError = true
        state.changeName.isSuccess = false
      })
      .addCase(changePassword.pending, (state) => {
        state.changePassword.isLoading = true
        state.changePassword.errorMessage = ''
        state.changePassword.errorCode = ''
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        if (action.payload) {
          state.changePassword.isLoading = false
          state.changePassword.isSuccess = true
          state.changePassword.errorMessage = ''
          state.changePassword.errorCode = ''
        }
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePassword.isLoading = false
        state.changePassword.isSuccess = false
        state.changePassword.errorMessage =
          (action.payload as ChangePassReject | undefined)?.message ||
          'Error al cambiar la contraseña'
        state.changePassword.errorCode =
          (action.payload as ChangePassReject | undefined)?.errorCode ||
          ''
      })
      .addCase(changeAddress.pending, (state) => {
        state.changeAddress.isLoading = true
        state.changeAddress.isError = false
        state.changeAddress.isSuccess = false
      })
      .addCase(changeAddress.fulfilled, (state, action) => {
        if (action.payload && state.user) {
          state.changeAddress.isLoading = false
          state.changeAddress.isError = false
          state.changeAddress.isSuccess = true
          state.user.addresses = action.payload.newAddresses
        }
      })
      .addCase(changeAddress.rejected, (state) => {
        state.changeAddress.isLoading = false
        state.changeAddress.isError = true
        state.changeAddress.isSuccess = false
      })
      .addCase(changeMainAddress.pending, (state) => {
        state.changeMainAddress.isLoading = true
        state.changeMainAddress.isError = false
        state.changeMainAddress.isSuccess = false
      })
      .addCase(changeMainAddress.fulfilled, (state, action) => {
        if (state.user) {
          state.changeMainAddress.isLoading = false
          state.changeMainAddress.isError = false
          state.changeMainAddress.isSuccess = true
          state.user.addresses = action.payload.newAddresses
        }
      })
      .addCase(changeMainAddress.rejected, (state) => {
        state.changeMainAddress.isLoading = false
        state.changeMainAddress.isError = true
        state.changeMainAddress.isSuccess = false
      })
      .addCase(deleteAddress.pending, (state) => {
        state.deleteAddress.isLoading = true
        state.deleteAddress.isError = false
        state.deleteAddress.isSuccess = false
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        if (action.payload && state.user) {
          state.deleteAddress.isLoading = false
          state.deleteAddress.isError = false
          state.deleteAddress.isSuccess = true
          state.user.addresses = action.payload.addresses
        }
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.deleteAddress.isLoading = false
        state.deleteAddress.isError = true
        state.deleteAddress.isSuccess = false
      })
      .addCase(addAddress.pending, (state) => {
        state.addAddress.isLoading = true
        state.addAddress.isError = false
        state.addAddress.isSuccess = false
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        if (action.payload && state.user) {
          state.addAddress.isLoading = false
          state.addAddress.isError = false
          state.addAddress.isSuccess = true
          state.user.addresses = action.payload.addresses
        }
      })
      .addCase(addAddress.rejected, (state) => {
        state.addAddress.isLoading = false
        state.addAddress.isError = true
        state.addAddress.isSuccess = false
      })
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPassword.isLoading = true
        state.forgotPassword.isError = false
        state.forgotPassword.isSuccess = false
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        if (action.payload) {
          state.forgotPassword.isLoading = false
          state.forgotPassword.isError = false
          state.forgotPassword.isSuccess = true
          state.forgotPassword.message = action.payload.message
          state.forgotPassword.sentEmail = action.payload.email
        }
        
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPassword.isLoading = false
        state.forgotPassword.isError = true
        state.forgotPassword.isSuccess = false
        state.forgotPassword.message = action.payload as string || 'Error al enviar solicitud'
        state.forgotPassword.sentEmail = action.meta.arg
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPassword.isLoading = true
        state.resetPassword.isError = false
        state.resetPassword.isSuccess = false
        state.resetPassword.message = ''
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPassword.isLoading = false
        state.resetPassword.isError = false
        state.resetPassword.isSuccess = true
        state.resetPassword.message = action.payload.message
      }) 
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassword.isLoading = false
        state.resetPassword.isError = true
        state.resetPassword.isSuccess = false
        state.resetPassword.message = action.payload as string || 'Error al reiniciar contraseña'
      })
      .addCase(checkResetPasswordToken.pending, (state) => {
        state.checkPasswordToken.isLoading = true
        state.checkPasswordToken.isSuccess = false
        state.checkPasswordToken.isError = false
      })
      .addCase(checkResetPasswordToken.fulfilled, (state, action) => {
        state.checkPasswordToken.isLoading = false
        state.checkPasswordToken.isSuccess = true
        state.checkPasswordToken.isError = false
        state.checkPasswordToken.message = action.payload
      })
      .addCase(checkResetPasswordToken.rejected, (state, action) => {
        state.checkPasswordToken.isLoading = false
        state.checkPasswordToken.isSuccess = false
        state.checkPasswordToken.isError = true
        state.checkPasswordToken.message = action.payload as string
      })
  },
})

export const {
  resetCheckAuth,
  resetLogin,
  resetRegister,
  resetVerifyEmail,
  resetJustRegistered,
  resetAddAddress,
  resetForgotPassword,
  resetCheckPasswordToken,
} = authSlice.actions
export default authSlice.reducer

