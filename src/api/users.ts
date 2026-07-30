import apiClient from '@/axios'
import type { User, UserUpdateRequest } from '@/types/api'

export const usersApi = {
  getById: (id: string) => apiClient.get<User>(`/users/${id}`),

  update: (id: string, data: UserUpdateRequest) => apiClient.put<User>(`/users/${id}`, data),

  uploadAvatar: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient.post<User>(`/users/${id}/avatar`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
