import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { PageLoader } from "../components/PageLoader";

// Protege rutas: redirige al login si no hay sesión activa verificada por el servidor.
export function RequireTemporalUser() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}