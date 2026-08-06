import apiClient from '@/axios'
import type { Business, BusinessCategory, Page } from '@/types/api'

export const businessesApi = {
  getAll: (params?: { page?: number; size?: number; sort?: string; q?: string; city?: string; category?: BusinessCategory }) =>
    apiClient.get<Page<Business>>('/businesses', { params }),

  getCities: () => apiClient.get<string[]>('/businesses/cities'),

  getById: (id: string) => apiClient.get<Business>(`/businesses/${id}`),
}
