import apiClient from '@/axios'
import type { Business, BusinessCategory, Page, PublicBusinessSummary } from '@/types/api'

export const businessesApi = {
  getPublic: (params?: { page?: number; size?: number; sort?: string; q?: string; city?: string; category?: BusinessCategory }) =>
    apiClient.get<Page<PublicBusinessSummary>>('/public/businesses', { params }),

  getPublicCities: () => apiClient.get<string[]>('/public/businesses/cities'),

  getAll: (params?: { page?: number; size?: number; sort?: string; q?: string; city?: string; category?: BusinessCategory }) =>
    apiClient.get<Page<Business>>('/businesses', { params }),

  getCities: () => apiClient.get<string[]>('/businesses/cities'),

  getById: (id: string) => apiClient.get<Business>(`/businesses/${id}`),
}
