import axios from "axios";

/**
 * Instancia centralizada de Axios.
 * - Request interceptor: inyecta el JWT del localStorage en cada petición.
 * - Response interceptor: manejo global de errores HTTP (401, etc.).
 */
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
    },
});

// Interceptor de Request: adjuntar token JWT 
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de Response: manejo global de errores 
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosClient;