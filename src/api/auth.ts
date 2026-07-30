import apiClient from '@/axios'
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/api'

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterRequest) => apiClient.post<AuthResponse>('/auth/register', data),
}
