import axios from "axios";
import { API_ACTIVITY_EVENT } from "../shared/hooks/useInactivityTimeout";

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

// Interceptor de Request: señaliza actividad de red para reiniciar el contador de inactividad
axiosClient.interceptors.request.use((config) => {
    window.dispatchEvent(new CustomEvent(API_ACTIVITY_EVENT));
    return config;
});

// Interceptor de Response: refresco silencioso del access_token ante 401
axiosClient.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        // No intentar refrescar si la petición fallida ES el endpoint de refresh
        // (evita loop infinito y falsos positivos de sesión expirada).
        const isRefreshRequest = originalRequest?.url === "/auth/refresh";

        if (err.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
            originalRequest._retry = true;
            try {
                // El backend lee refresh_token de la cookie y devuelve un nuevo access_token como cookie.
                // Se pasa {} como body para que Axios NO elimine el header Content-Type (lo hace cuando data es undefined).
                await axiosClient.post("/auth/refresh", {});
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