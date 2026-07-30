export interface LoginRequest {
  login: string
  password: string
}

export interface RegisterRequest {
  login: string
  password: string
  displayName: string
  email: string
  phone: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresInSeconds: number
  userId: string
  login: string
  displayName: string | null
  avatarUrl: string | null
  businessOwner: boolean
  admin: boolean
  roles: string[]
}

export type BusinessStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'DRAFT' | 'PENDING_REVIEW'

export interface Business {
  id: string
  ownerId: string
  name: string
  description: string
  status: BusinessStatus
  contactPhone: string
  addressLine: string
  city: string
  latitude?: number
  longitude?: number
  accessAllowed: boolean
  createdAt: string
  updatedAt: string
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface OfferedService {
  id: string
  businessId: string
  name: string
  description: string
  basePrice: number
  durationMinutes: number
  active: boolean
  imageUrl: string | null
}

export interface StaffMember {
  id: string
  businessId: string
  linkedUserId: string | null
  displayName: string
  active: boolean
}

export type Weekday = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

export interface BusinessHours {
  id: string
  businessId: string
  weekday: Weekday
  closed: boolean
  opensAt: string | null
  closesAt: string | null
}

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED_BY_CUSTOMER'
  | 'CANCELLED_BY_BUSINESS'
  | 'NO_SHOW'

export interface Booking {
  id: string
  customerId: string | null
  customerName?: string | null
  guestName: string | null
  guestPhone: string | null
  businessId: string
  businessName?: string
  offeredServiceId: string
  offeredServiceName?: string
  staffId: string | null
  staffName?: string | null
  startAt: string
  endAt: string
  status: BookingStatus
  customerNote: string
  createdAt: string
  updatedAt: string
}

export interface BookingCreateRequest {
  customerId?: string
  guestName?: string
  guestPhone?: string
  businessId: string
  offeredServiceId: string
  staffId?: string
  startAt: string
  endAt: string
  status?: BookingStatus
  customerNote?: string
}

export interface BookingUpdateRequest {
  staffId?: string
  startAt?: string
  endAt?: string
  status?: BookingStatus
  customerNote?: string
}

export interface User {
  id: string
  login: string
  displayName: string
  email: string
  phone: string
  avatarUrl: string | null
}

export interface UserUpdateRequest {
  password?: string
  displayName?: string
  email?: string
  phone?: string
}

export interface Review {
  id: string
  bookingId: string
  businessId: string | null
  staffId: string | null
  staffName: string | null
  customerName?: string | null
  stars: number
  comment: string
  createdAt: string
}
