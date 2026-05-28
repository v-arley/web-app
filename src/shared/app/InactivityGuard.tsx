import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useInactivityTimeout } from "../hooks/useInactivityTimeout";
import { ROUTES } from "../../router/routes";

/**
 * Componente sin salida visual que gestiona el cierre de sesión automático
 * por inactividad del usuario.
 *
 * Debe montarse dentro del árbol del router (acceso a `useNavigate`) y dentro
 * de `AuthProvider` (acceso a `useAuth`). La ubicación correcta es `AppLayout`,
 * que ya cumple ambas condiciones al estar dentro de `RouterProvider` y de
 * `AuthProvider`.
 *
 * Flujo al expirar el tiempo sin actividad:
 *  1. Llama a `logout()` → invalida la sesión en el backend y limpia el estado.
 *  2. Navega a `/login` via React Router (sin recarga de página).
 */
export function InactivityGuard(): null {
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleTimeout = useCallback(async () => {
        try {
            await logout();
        } finally {
            navigate(ROUTES.LOGIN, { replace: true });
        }
    }, [logout, navigate]);

    useInactivityTimeout(handleTimeout, isAuthenticated);

    return null;
}
