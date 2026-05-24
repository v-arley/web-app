import { useQuery } from "@tanstack/react-query";
import { globalDashboardService } from "../services/global-dashboard.service";
import type { GlobalDashboardQueryData } from "../utils/global-dashboard.types";

export function useGlobalDashboardQuery() {
    return useQuery<GlobalDashboardQueryData, Error>({
        queryKey: ["management-modules", "dashboard", "global-dashboard"],
        queryFn: () => globalDashboardService.getSnapshot(),
        retry: false,
        refetchOnWindowFocus: false,
    });
}
