interface ApiErrorBody {
  message?: string
  errorId?: string | null
  path?: string
  status?: number
}

export function apiErrorMessage(error: unknown, fallback: string) {
  const body = (error as { response?: { data?: ApiErrorBody } })?.response?.data
  if (!body?.message) return fallback
  return body.errorId ? `${body.message} (ID: ${body.errorId})` : body.message
}
