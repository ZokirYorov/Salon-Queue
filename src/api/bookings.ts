import apiClient from '@/axios'
import type { Booking, BookingCreateRequest, BookingUpdateRequest, Page } from '@/types/api'

export const bookingsApi = {
  getAll: (params?: { customerId?: string; businessId?: string; date?: string; page?: number; size?: number }) =>
    apiClient.get<Page<Booking>>('/bookings', { params }),

  create: (data: BookingCreateRequest) => apiClient.post<Booking>('/bookings', data),

  update: (id: string, data: BookingUpdateRequest) =>
    apiClient.put<Booking>(`/bookings/${id}`, data),
}
