import axios from "axios";

/**
 * Instancia centralizada de Axios.
 * - Las cookies httpOnly (access_token, refresh_token) son enviadas automáticamente por el navegador.
 * - Response interceptor: refresca el access_token ante un 401 y reintenta la petición original.
 */
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
    },
});

// Interceptor de Response: refresco silencioso del access_token ante 401
axiosClient.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // El backend lee refresh_token de la cookie y devuelve un nuevo access_token como cookie
                await axiosClient.post("/auth/refresh");
                return axiosClient(originalRequest);
            } catch (refreshError) {
                // Notifica a AuthContext para que invalide el estado sin recargar la página.
                // AuthContext escucha este evento y redirige via React Router.
                window.dispatchEvent(new CustomEvent("auth:session-expired"));
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(err);
    }
);

export default axiosClient;