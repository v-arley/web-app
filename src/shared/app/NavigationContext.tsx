/* eslint-disable react-refresh/only-export-components */
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
import { ROUTES } from "../../router/routes";
import { SECTIONS } from "./sections";
import { useAuth } from "./AuthContext";

type NavigationContextValue = {
    sections: DashboardSection[];
    activeKey: string;
    activeSection: DashboardSection | undefined;
    navigate: (key: string) => void;
    authContext: AuthContext;
    activeCamp: Camp | null;
    activeCampStatus: "idle" | "loading" | "ready" | "missing" | "error";
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

const campSvc = new CampService();

function pathMatchesRoute(pathname: string, routePath: string) {
    return pathname === routePath || pathname.startsWith(routePath + "/");
}

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
            (s) => pathMatchesRoute(location.pathname, s.path),
        );
        return matched?.key ?? "";
    }, [location.pathname, availableSections]);

    // Ruta registrada sin permiso -> 403. Ruta no registrada -> queda para el 404 del router.
    useEffect(() => {
        if (location.pathname === ROUTES.FORBIDDEN) return;

        const accessible = availableSections.some(
            (s) => pathMatchesRoute(location.pathname, s.path),
        );
        if (accessible) return;

        const registeredSection = SECTIONS.some(
            (s) => pathMatchesRoute(location.pathname, s.path),
        );
        if (registeredSection) {
            routerNavigate(ROUTES.FORBIDDEN, { replace: true });
        }
    }, [location.pathname, availableSections, routerNavigate]);

    // Campo de campamento activo :::
    const [activeCamp, setActiveCamp] = useState<Camp | null>(null);
    const [activeCampStatus, setActiveCampStatus] =
        useState<NavigationContextValue["activeCampStatus"]>("idle");

    useEffect(() => {
        let ignore = false;

        if (authContext.userId == null) {
            queueMicrotask(() => {
                if (!ignore) {
                    setActiveCamp(null);
                    setActiveCampStatus("idle");
                }
            });
            return () => {
                ignore = true;
            };
        }

        queueMicrotask(() => {
            if (!ignore) {
                setActiveCamp(null);
                setActiveCampStatus("loading");
            }
        });
        campSvc
            .findVisibleForCurrentUser()
            .then((res) => {
                if (!res.getEstado() || ignore) {
                    if (!ignore) {
                        setActiveCamp(null);
                        setActiveCampStatus("missing");
                    }
                    return;
                }

                const camp = res.getResultado<Camp>("registro") ?? null;
                setActiveCamp(camp);
                setActiveCampStatus(camp ? "ready" : "missing");
            })
            .catch(() => {
                if (!ignore) {
                    setActiveCamp(null);
                    setActiveCampStatus("error");
                }
            });

        return () => {
            ignore = true;
        };
    }, [authContext.userId]);

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
                activeCampStatus,
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
