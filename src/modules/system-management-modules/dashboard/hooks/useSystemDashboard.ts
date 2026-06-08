import { useQuery } from "@tanstack/react-query";
import { systemDashboardService } from "../services/systemDashboardService";

export const SYSTEM_DASHBOARD_QUERY_KEY = ["system-management-modules", "dashboard", "overview"] as const;

export function useSystemDashboard() {
    return useQuery({
        queryKey: SYSTEM_DASHBOARD_QUERY_KEY,
        queryFn: systemDashboardService.getOverview,
    });
}
