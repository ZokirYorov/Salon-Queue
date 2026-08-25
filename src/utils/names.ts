export interface PersonLike {
  firstName?: string | null
  lastName?: string | null
  login?: string | null
}

export interface BookingNameLike {
  customerFirstName?: string | null
  customerLastName?: string | null
  guestName?: string | null
  staffFirstName?: string | null
  staffLastName?: string | null
}

export function personName(person?: PersonLike | null) {
  const name = [person?.firstName, person?.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ')

  return name || person?.login || ''
}

export function bookingCustomerName(booking: BookingNameLike, fallback = 'Mijoz') {
  const name = [booking.customerFirstName, booking.customerLastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ')

  return name || booking.guestName || fallback
}

export function bookingStaffName(booking: BookingNameLike, fallback = 'Usta tanlanmagan') {
  const name = [booking.staffFirstName, booking.staffLastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ')

  return name || fallback
}

export function reviewCustomerName(review: BookingNameLike, fallback = 'Mijoz') {
  return bookingCustomerName(review, fallback)
}

export function reviewStaffName(review: BookingNameLike, fallback = 'Usta tanlanmagan') {
  return bookingStaffName(review, fallback)
}

export function firstInitial(person?: PersonLike | null) {
  return (personName(person) || '?').charAt(0).toUpperCase()
}
