export interface PersonLike {
  firstName?: string | null
  lastName?: string | null
  login?: string | null
}

export function personName(person?: PersonLike | null) {
  const fullName = [person?.firstName, person?.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ')

  return fullName || person?.login || ''
}

export function firstInitial(person?: PersonLike | null) {
  return (personName(person) || '?').charAt(0).toUpperCase()
}

export function splitFullName(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean)
  const firstName = parts.shift() ?? ''
  const lastName = parts.join(' ')

  return {
    firstName,
    lastName: lastName || undefined,
  }
}
