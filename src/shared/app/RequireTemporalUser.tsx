import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Protege rutas: redirige al login si no hay sesión activa verificada por el servidor.
export function RequireTemporalUser() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        // Evita un destello de redirección mientras se verifica la sesión en /auth/me
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}