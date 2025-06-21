import { AxiosResponse } from 'axios'
import api from '@/lib/axios'
import {
  UserData,
  VerifyEmailResponse,
  RegisterResponse,
  UserResponse,
  LoginResponse,
  LogoutResponse,
  LoginData,
  LogoutData,
} from '@/shared/types/authTypes'

const register = async (userData: UserData): Promise<RegisterResponse> => {
  const response: AxiosResponse<RegisterResponse> = await api.post(
    '/users',
    userData
  )

  return response.data
}

const verifyEmail = async (code: string): Promise<VerifyEmailResponse> => {
  const response: AxiosResponse<VerifyEmailResponse> = await api.post(
    '/users/verify-email',
    { code }
  )

  return response.data
}

const checkAuth = async (): Promise<UserResponse> => {
  const response: AxiosResponse<UserResponse> = await api.get(
    '/users/check-auth',
    { withCredentials: true }
  )

  return response.data
}

const login = async (userData: LoginData): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await api.post(
    '/users/login',
    userData,
    { withCredentials: true },
  )
  
  return response.data
}

const logout = async ({ email, userId }: LogoutData): Promise<LogoutResponse> => {
  const response: AxiosResponse<LogoutResponse> = await api.post(
    '/users/logout',
    { email, userId },
    { withCredentials: true },
  )

  return response.data
}

const authService = {
  register,
  verifyEmail,
  checkAuth,
  login,
  logout,
}

export default authService
