import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
})

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
        // Faqat token yuborilgan so'rov 401 qaytarsa (ya'ni sessiya haqiqatan tugagan bo'lsa)
        // tozalaymiz — bo'lmasa, bu shunchaki tizimga kirmagan mehmonning ochiq sahifada
        // fon vazifasi (masalan kunlik bandlik) 401 olishi, bu sahifani majburan
        // login'ga uloqtirishga sabab bo'lmasligi kerak.
        const hadToken = Boolean(error.config?.headers?.Authorization);
        if (hadToken && error.response && error.response.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("current_user");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;