import apiClient from '@/axios'
import type { StaffMember } from '@/types/api'

export const staffApi = {
  getAll: (businessId: string) =>
    apiClient.get<StaffMember[]>(`/businesses/${businessId}/staff`),
}
