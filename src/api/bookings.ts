import apiClient from '@/axios'
import type { Booking, BookingAvailability, BookingCreateRequest, BookingUpdateRequest, Page } from '@/types/api'

export const bookingsApi = {
  getAll: (params?: { customerId?: string; customerAccountId?: string; businessId?: string; date?: string; page?: number; size?: number }) =>
    apiClient.get<Page<Booking>>('/bookings', { params }),

  availability: (params: { businessId: string; date: string }) =>
    apiClient.get<BookingAvailability[]>('/bookings/availability', { params }),

  create: (data: BookingCreateRequest) => apiClient.post<Booking>('/bookings', data),

  update: (id: string, data: BookingUpdateRequest) =>
    apiClient.put<Booking>(`/bookings/${id}`, data),
}
