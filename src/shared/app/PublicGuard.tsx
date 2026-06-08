import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { PageLoader } from "../components/PageLoader";
import { getInitialSectionPath } from "../utils/authAccess";
import { SECTIONS } from "./sections";

/**
 * Protege rutas públicas (ej. /login).
 * Si el usuario ya está autenticado, lo redirige a la app.
 */
export function PublicGuard() {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) return <PageLoader />;
    if (isAuthenticated && user) {
        return <Navigate to={getInitialSectionPath(SECTIONS, user)} replace />;
    }

    return <Outlet />;
}
