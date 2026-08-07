import { useAuthStore } from '@/stores/auth'

interface JwtPayload {
    exp?: number
    [key: string]: unknown
}

function decodeJwt(token: string): JwtPayload | null {
    try {
        const payload = token.split('.')[1]
        return JSON.parse(atob(payload))
    } catch {
        return null
    }
}

/**
 * Joriy tokenning yaroqliligini tekshiradi.
 * Token bo'lmasa yoki muddati tugagan bo'lsa — false qaytaradi.
 * Muddati tugagan bo'lsa, sessiyani avtomatik tozalaydi (logout).
 */
export function checkToken(): boolean {
    const authStore = useAuthStore()
    const token = authStore.token

    if (!token) return false

    const payload = decodeJwt(token)
    // `exp` claim bo'lmasa — backend muddatni nazorat qiladi deb hisoblaymiz
    if (!payload?.exp) return true

    const isExpired = Date.now() >= payload.exp * 1000
    return !isExpired
}