import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { PageLoader } from "../components/PageLoader";

/**
 * Protege rutas públicas (ej. /login).
 * Si el usuario ya está autenticado, lo redirige a la app.
 */
export function PublicGuard() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <PageLoader />;
    if (isAuthenticated) return <Navigate to="/app/dashboard" replace />;

    return <Outlet />;
}
