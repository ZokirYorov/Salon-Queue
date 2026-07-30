import apiClient from '@/axios'
import type { BusinessHours } from '@/types/api'

export const businessHoursApi = {
  getAll: (businessId: string) =>
    apiClient.get<BusinessHours[]>(`/businesses/${businessId}/hours`),
}
