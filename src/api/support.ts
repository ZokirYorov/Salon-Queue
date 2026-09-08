import apiClient from '@/axios'

export type SupportStatus = 'NEW' | 'IN_PROGRESS' | 'WAITING_USER' | 'RESOLVED' | 'CLOSED'

export interface SupportMessage {
  id: string
  sender: 'USER' | 'OPERATOR'
  content: string
  mediaType: string | null
  createdAt: string
}

export interface SupportTicket {
  id: string
  subject: string
  status: SupportStatus
  updatedAt: string
  messages: SupportMessage[]
}

export const supportApi = {
  createTelegramLink: () => apiClient.post<{ url: string }>('/telegram/link', null, { params: { source: 'USER_APP' } }),
  mine: () => apiClient.get<{ content: SupportTicket[] }>('/support/tickets'),
  mineGet: (id: string) => apiClient.get<SupportTicket>(`/support/tickets/${id}`),
}
