import axios from "axios";

const axiosInstance = axios.create({
    // Proxy ishlashi uchun baseURL to'liq manzil bo'lmasligi kerak.
    // Barcha so'rovlar /api/v1/... dan boshlanadi va vite proxy'si buni to'g'ri manzilga yo'naltiradi.
    baseURL: `${import.meta.env.VITE_BASE_API}/api/v1`,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000,
})

function isAuthRequest(url?: string) {
    return !!url && (
        url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/password-reset')
    );
}

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const hadToken = Boolean(error.config?.headers?.Authorization);
        if (hadToken && error.response?.status === 401 && !isAuthRequest(error.config?.url)) {
            import('@/stores/auth').then(({ useAuthStore }) => {
                useAuthStore().logout();
            });
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
