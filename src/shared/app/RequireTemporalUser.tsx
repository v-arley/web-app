import { Navigate, Outlet } from "react-router-dom";

// Protege rutas: acepta token JWT (localStorage) o sesión temporal (sessionStorage)
export function RequireTemporalUser() {
    const token = localStorage.getItem("token");
    const activeUser = sessionStorage.getItem("activeUser");

    if (!token && !activeUser) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}