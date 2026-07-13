import apiClient from '@/axios'
import type { Review } from '@/types/api'

export interface ReviewCreateRequest {
  bookingId: string
  stars: number
  comment?: string
}

export const reviewsApi = {
  getAll: (params?: { businessId?: string; staffId?: string }) =>
    apiClient.get<Review[]>('/reviews', { params: params ?? {} }),

  create: (data: ReviewCreateRequest) => apiClient.post<Review>('/reviews', data),
}
