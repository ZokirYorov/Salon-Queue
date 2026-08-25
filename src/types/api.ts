export interface LoginRequest {
  login: string
  password: string
}

export interface RegisterRequest {
  login: string
  password: string
  firstName: string
  lastName?: string
  email: string
  phone: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresInSeconds: number
  userId: string
  login: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  businessOwner: boolean
  admin: boolean
  roles: string[]
}

export interface PasswordResetRequest {
  login: string
}

export interface PasswordResetConfirmRequest {
  login: string
  code: string
  newPassword: string
}

export type BusinessStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'DRAFT' | 'PENDING_REVIEW'
export type BusinessCategory =
  | 'BARBER'
  | 'BEAUTY'
  | 'MEDICAL'
  | 'REPAIR'
  | 'CONSULTING'
  | 'EDUCATION'
  | 'FITNESS'
  | 'AUTO'
  | 'LEGAL'
  | 'OTHER'

export interface Business {
  id: string
  ownerId: string
  name: string
  description: string
  category: BusinessCategory
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

export interface PublicBusinessSummary {
  id: string
  name: string
  description: string | null
  addressLine: string | null
  city: string | null
  contactPhone: string | null
  category: BusinessCategory
  imageUrl: string | null
  serviceCount: number
  avgRating: number
  reviewCount: number
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
  firstName: string
  lastName: string | null
  serviceIds: string[]
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
  customerAccountId?: string | null
  customerFirstName?: string | null
  customerLastName?: string | null
  customerMiddleName?: string | null
  customerPhone?: string | null
  businessId: string
  businessName?: string
  offeredServiceId: string
  offeredServiceName?: string
  staffId: string | null
  staffFirstName?: string | null
  staffLastName?: string | null
  startAt: string
  endAt: string
  status: BookingStatus
  customerNote: string
  createdAt: string
  updatedAt: string
}

export interface BookingAvailability {
  id: string
  staffId: string | null
  startAt: string
  endAt: string
  status: BookingStatus
}

export interface BookingCreateRequest {
  customerId?: string
  customerFirstName?: string
  customerLastName?: string
  customerMiddleName?: string
  customerPhone?: string
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
  firstName: string | null
  lastName: string | null
  email: string
  phone: string
  avatarUrl: string | null
}

export interface UserUpdateRequest {
  password?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface Review {
  id: string
  bookingId: string
  businessId: string | null
  staffId: string | null
  staffFirstName: string | null
  staffLastName: string | null
  customerFirstName?: string | null
  customerLastName?: string | null
  stars: number
  comment: string
  createdAt: string
}
