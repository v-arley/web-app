import { useNavigation } from "../app/NavigationContext";
import { WarehouseView } from "./WarehouseView";

/**
 * DashboardPage — renderiza la seccion activa del NavigationContext.
 * El layout (Sidebar + Header) lo provee AppLayout.
 */
export function DashboardPage() {
    const { activeSection, activeCamp } = useNavigation();

    if (!activeSection) return null;

    // WarehouseView recibe activeCamp como prop opcional
    if (activeSection.key === "warehouse") {
        return <WarehouseView activeCamp={activeCamp} />;
    }

    return <>{activeSection.component()}</>;
}
