/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthContext as UserInfo } from "../utils/authAccess";
import { AuthService } from "../../services/AuthService";
import { INACTIVITY_TIMEOUT_MS, USER_ACTIVITY_EVENTS } from "../hooks/useInactivityTimeout";

// Types :::

type AuthState = {
    user: UserInfo | null;
    isAuthenticated: boolean;
    /** true mientras se verifica la sesión en el primer montaje */
    isLoading: boolean;
};

type AuthContextValue = AuthState & {
    login: (username: string, password: string) => Promise<UserInfo>;
    logout: () => Promise<void>;
};

// Constants :::

/**
 * Clave de sessionStorage que marca si esta pestaña tiene una sesión activa.
 * sessionStorage es por-pestaña: no se comparte entre pestañas nuevas,
 * pero sí persiste al refrescar la misma pestaña.
 */
const TAB_SESSION_KEY = "tab:session";
const SESSION_KEEPALIVE_INTERVAL_MS = 14 * 60 * 1_000;

// Context :::

const AuthContext = createContext<AuthContextValue | null>(null);

const authService = new AuthService();

// Provider :::

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    // isLoading se inicializa en true solo si esta pestaña tiene marcador de sesión.
    // Así evitamos llamar a /auth/me cuando ya sabemos que no hay sesión en esta pestaña,
    // y eliminamos el setState síncrono dentro del effect.
    const [state, setState] = useState<AuthState>(() => ({
        user: null,
        isAuthenticated: false,
        isLoading: Boolean(sessionStorage.getItem(TAB_SESSION_KEY)),
    }));

    // Verificar sesión al montar :::
    // Solo llama a /auth/me si esta pestaña tiene un marcador de sesión.
    // Esto garantiza el aislamiento: una pestaña nueva no hereda la sesión
    // de otras pestañas aunque las cookies httpOnly estén presentes.
    // Cuando no hay marcador, isLoading ya es false (inicializado arriba)
    // y RequireTemporalUser redirige al login sin necesidad de setState aquí.
    useEffect(() => {
        if (!sessionStorage.getItem(TAB_SESSION_KEY)) return;

        authService
            .me()
            .then((user) => {
                setState({ user, isAuthenticated: user !== null, isLoading: false });
            })
            .catch(() => {
                sessionStorage.removeItem(TAB_SESSION_KEY);
                setState({ user: null, isAuthenticated: false, isLoading: false });
            });
    }, []);

    // Expiración de sesión emitida por axiosClient :::
    useEffect(() => {
        const handleSessionExpired = () => {
            void queryClient.cancelQueries();
            queryClient.clear();
            sessionStorage.removeItem(TAB_SESSION_KEY);
            setState({ user: null, isAuthenticated: false, isLoading: false });
        };
        window.addEventListener("auth:session-expired", handleSessionExpired);
        return () => window.removeEventListener("auth:session-expired", handleSessionExpired);
    }, [queryClient]);

    useEffect(() => {
        if (!state.isAuthenticated) return;

        let lastUiActivityAt = Date.now();
        const markUiActivity = () => {
            lastUiActivityAt = Date.now();
        };

        USER_ACTIVITY_EVENTS.forEach((event) =>
            window.addEventListener(event, markUiActivity, { passive: true }),
        );

        const intervalId = window.setInterval(() => {
            const isRecentlyActive = Date.now() - lastUiActivityAt < INACTIVITY_TIMEOUT_MS;
            if (!isRecentlyActive) return;

            authService.refreshSession().catch(() => {
                window.dispatchEvent(new CustomEvent("auth:session-expired"));
            });
        }, SESSION_KEEPALIVE_INTERVAL_MS);

        return () => {
            window.clearInterval(intervalId);
            USER_ACTIVITY_EVENTS.forEach((event) =>
                window.removeEventListener(event, markUiActivity),
            );
        };
    }, [state.isAuthenticated]);

    const login = useCallback(async (username: string, password: string) => {
        const user = await authService.login(username, password);
        // Marca esta pestaña como autenticada. Las pestañas nuevas no heredarán este marcador.
        sessionStorage.setItem(TAB_SESSION_KEY, "1");
        setState({ user, isAuthenticated: true, isLoading: false });
        return user;
    }, []);

    const logout = useCallback(async () => {
        try {
            await queryClient.cancelQueries();
            await authService.logout();
        } finally {
            // Asegura expulsión local incluso si el backend no responde.
            queryClient.clear();
            sessionStorage.removeItem(TAB_SESSION_KEY);
            setState({ user: null, isAuthenticated: false, isLoading: false });
        }
    }, [queryClient]);

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook :::

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    }
    return ctx;
}
