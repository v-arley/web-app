import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
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
    const authContext: AuthContext = useMemo(
        () => user ?? { name: "", roles: [] },
        [user],
    );

    const availableSections = useMemo(
        () => getAvailableSections(SECTIONS, authContext),
        [authContext],
    );
    const [activeKey, setActiveKey] = useState(
        () => availableSections[0]?.key ?? "",
    );

    // Cuando cambia el conjunto de secciones disponibles (login / cambio de rol),
    // resetea la sección activa a la primera del nuevo conjunto si la actual ya no existe.
    useEffect(() => {
        if (availableSections.length === 0) return;
        const stillAvailable = availableSections.some((s) => s.key === activeKey);
        if (!stillAvailable) {
            setActiveKey(availableSections[0].key);
        }
    }, [availableSections, activeKey]);
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

    const navigate = useCallback((key: string) => {
        setActiveKey(key);
    }, []);

    const activeSection =
        availableSections.find((s) => s.key === activeKey) ??
        availableSections[0];

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
