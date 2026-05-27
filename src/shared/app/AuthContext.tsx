import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { AuthContext as UserInfo } from "../utils/authAccess";
import { AuthService } from "../../services/AuthService";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthState = {
    user: UserInfo | null;
    isAuthenticated: boolean;
    /** true mientras se verifica la sesión en el primer montaje */
    isLoading: boolean;
};

type AuthContextValue = AuthState & {
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

const authService = new AuthService();

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Verificar sesión activa al montar la app vía /auth/me
    useEffect(() => {
        authService
            .me()
            .then((user) => {
                setState({ user, isAuthenticated: user !== null, isLoading: false });
            })
            .catch(() => {
                setState({ user: null, isAuthenticated: false, isLoading: false });
            });
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        const user = await authService.login(username, password);
        setState({ user, isAuthenticated: true, isLoading: false });
    }, []);

    const logout = useCallback(async () => {
        await authService.logout();
        setState({ user: null, isAuthenticated: false, isLoading: false });
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    }
    return ctx;
}
