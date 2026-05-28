import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Camp } from "../../models/Camp";
import { CampService } from "../../services/CampService";
import type { DashboardSection } from "../hooks/useDashboardNav";
import {
    getAvailableSections,
    type AuthContext,
} from "../utils/authAccess";
import { SECTIONS } from "./sections";
import { useAuth } from "./AuthContext";

type NavigationContextValue = {
    sections: DashboardSection[];
    activeKey: string;
    activeSection: DashboardSection | undefined;
    navigate: (key: string) => void;
    authContext: AuthContext;
    activeCamp: Camp | null;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

const campSvc = new CampService();

export function NavigationProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const routerNavigate = useNavigate();
    const location = useLocation();

    const authContext: AuthContext = useMemo(
        () => user ?? { name: "", roles: [] },
        [user],
    );

    const availableSections = useMemo(
        () => getAvailableSections(SECTIONS, authContext),
        [authContext],
    );

    // activeKey derivado de la URL actual :::
    const activeKey = useMemo(() => {
        const matched = availableSections.find(
            (s) =>
                location.pathname === s.path ||
                location.pathname.startsWith(s.path + "/"),
        );
        return matched?.key ?? availableSections[0]?.key ?? "";
    }, [location.pathname, availableSections]);

    // Redirige a la primera sección accesible si la URL actual no lo está :::
    useEffect(() => {
        if (availableSections.length === 0) return;
        const accessible = availableSections.some(
            (s) =>
                location.pathname === s.path ||
                location.pathname.startsWith(s.path + "/"),
        );
        if (!accessible) {
            routerNavigate(availableSections[0].path, { replace: true });
        }
    }, [location.pathname, availableSections, routerNavigate]);

    // Campo de campamento activo :::
    const [activeCamp, setActiveCamp] = useState<Camp | null>(null);

    useEffect(() => {
        campSvc
            .findAll()
            .then((res) => {
                if (res.getEstado()) {
                    const camps = res.getResultado<Camp[]>("registros") ?? [];
                    setActiveCamp(
                        camps.find((c) => c.state === "A" || c.active) ??
                            camps[0] ??
                            null,
                    );
                }
            })
            .catch(() => {});
    }, [authContext.campId]);

    // navigate(key) → cambia la URL a la ruta de la sección :::
    const navigate = useCallback(
        (key: string) => {
            const section = availableSections.find((s) => s.key === key);
            if (section) {
                routerNavigate(section.path);
            }
        },
        [availableSections, routerNavigate],
    );

    const activeSection = availableSections.find((s) => s.key === activeKey);

    return (
        <NavigationContext.Provider
            value={{
                sections: availableSections,
                activeKey,
                activeSection,
                navigate,
                authContext,
                activeCamp,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation(): NavigationContextValue {
    const ctx = useContext(NavigationContext);
    if (!ctx) {
        throw new Error("useNavigation debe usarse dentro de NavigationProvider");
    }
    return ctx;
}
