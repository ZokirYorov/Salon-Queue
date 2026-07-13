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
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("current_user");
            if (location.pathname !== '/login') {
                location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;