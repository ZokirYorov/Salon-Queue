import apiClient from '@/axios'
import type { Business, Page } from '@/types/api'

export const businessesApi = {
  getAll: (params?: { page?: number; size?: number }) =>
    apiClient.get<Page<Business>>('/businesses', { params }),

  getById: (id: string) => apiClient.get<Business>(`/businesses/${id}`),
}
