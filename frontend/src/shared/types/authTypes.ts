export interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'customer'
  addresses: Address[]
  lastLogin: Date
}

export type Address = {
  _id: string
  isMain: boolean
  fullName: string
  phone: string
  department: string
  city: string
  addressInfo: {
    street: string
    number1: string
    number2: string
    additionalInfo?: string
    postalCode?: string
  }
  addressType: 'hogar' | 'trabajo' | 'casillero'
}

export type UserData = {
  name: string
  email: string
  password: string
  recaptchaToken: string
}

export type LoginData = {
  email: string
  password: string
  recaptchaToken: string
}

export type LogoutData = {
  email: string
  userId: string
}

// State type

export interface AuthState {
  user: User | null
  login: {
    isError: boolean
    isSuccess: boolean
    isLoading: boolean
    message: string
  }
  loginDemo: {
    isLoading: boolean
    isSuccess: boolean
    isError: boolean
    message: string
  }
  checkAuth: {
    isError: boolean
    isSuccess: boolean
    isLoading: boolean
    isChecked: boolean
    message: string
  }
  register: {
    isError: boolean
    isSuccess: boolean
    isLoading: boolean
    message: string
  }
  verifyEmail: {
    isError: boolean
    isSuccess: boolean
    isLoading: boolean
    message: string
  }
  logout: {
    isLoading: boolean
    isSuccess: boolean
    isError: boolean
    errorMessage: string
  }
  forgotPassword: {
    isLoading: boolean
    isSuccess: boolean
    isError: boolean
    message: string
    sentEmail: string
  }
  resetPassword: {
    isLoading: boolean
    isSuccess: boolean
    isError: boolean
    message: string,
  }
  checkPasswordToken: {
    isLoading: boolean
    isSuccess: boolean
    isError: boolean
    message: string
  }
  changeName: {
    isLoading: boolean
    isSuccess: boolean
    isError: boolean
  }
  changePassword: {
    isLoading: boolean
    isSuccess: boolean
    errorMessage: string
    errorCode:
      | 'USER_NOT_FOUND'
      | 'FIELDS_REQUIRED'
      | 'SAME_PASSWORD'
      | 'INCORRECT_PASSWORD'
      | ''
  }
  changeAddress: {
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
  }
  changeMainAddress: {
    isLoading: boolean,
    isError: boolean,
    isSuccess: boolean,
  }
  deleteAddress: {
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
  }
  addAddress: {
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
  }
  justRegistered: boolean
}

export interface VerifyEmailResponse {
  message: string
  user: User
}

export interface RegisterResponse {
  message: string
}

export interface UserResponse {
  message: string
  user: User
}

export interface LoginResponse {
  message: string
  user: User
}

export interface LogoutResponse {
  message: string
}

export interface ChangeNameResponse {
  message: string
  name: string
}

export interface ChangePassReject {
  message: string
  errorCode:
  | 'USER_NOT_FOUND'
  | 'FIELDS_REQUIRED'
  | 'SAME_PASSWORD'
  | 'INCORRECT_PASSWORD'
  | ''
}