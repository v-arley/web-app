import { useState, useCallback, type ReactNode } from "react";

export type DashboardSection = {
    key: string;
    /** Ruta absoluta en el navegador, ej. "/app/dashboard" */
    path: string;
    label: string;
    icon?: ReactNode;
    component: () => ReactNode;
};

export function useDashboardNav(sections: DashboardSection[], defaultKey?: string) {
    const initial = defaultKey ?? sections[0]?.key ?? "";
    const [activeKey, setActiveKey] = useState(initial);

    const navigate = useCallback((key: string) => {
        setActiveKey(key);
    }, []);

    const activeSection = sections.find((s) => s.key === activeKey) ?? sections[0];

    return {
        activeKey,
        activeSection,
        sections,
        navigate,
    };
}
