import apiClient from '@/axios'
import type { OfferedService } from '@/types/api'

export const servicesApi = {
  getAll: (businessId: string) =>
    apiClient.get<OfferedService[]>(`/businesses/${businessId}/services`),
}
