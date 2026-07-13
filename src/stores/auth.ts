import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api/auth'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/api'

interface CurrentUser {
  userId: string
  login: string
  displayName: string | null
  avatarUrl?: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const user = ref<CurrentUser | null>(JSON.parse(localStorage.getItem('current_user') || 'null'))

  function persist(res: AuthResponse) {
    token.value = res.accessToken
    user.value = { userId: res.userId, login: res.login, displayName: res.displayName, avatarUrl: res.avatarUrl }
    localStorage.setItem('access_token', res.accessToken)
    localStorage.setItem('current_user', JSON.stringify(user.value))
  }

  function updateProfile(partial: { displayName?: string; avatarUrl?: string | null }) {
    if (!user.value) return
    user.value = { ...user.value, ...partial }
    localStorage.setItem('current_user', JSON.stringify(user.value))
  }

  function updateAvatar(avatarUrl: string | null) {
    updateProfile({ avatarUrl })
  }

  async function login(data: LoginRequest) {
    const { data: res } = await authApi.login(data)
    persist(res)
  }

  async function register(data: RegisterRequest) {
    const { data: res } = await authApi.register(data)
    persist(res)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('current_user')
  }

  return { token, user, login, register, logout, updateProfile, updateAvatar }
})
