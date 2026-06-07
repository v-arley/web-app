import { useQuery } from "@tanstack/react-query";
import type { ResourceAlertFormValues } from "../schemas/resource-alert.schema";
import { resourceAlertService } from "../services/ResourceAlertService";
import type { PaginatedResult } from "../../../../shared/utils/Response";

export const RESOURCE_ALERTS_QUERY_KEY = ["resource-management-modules", "inventory", "alerts"] as const;

export function useAlertsQuery(campId: number, enabled = true, resolved: "Y" | "N" = "N", pagination?: { page?: number; limit?: number }) {
    const query = useQuery<PaginatedResult<ResourceAlertFormValues>, Error>({
        queryKey: [...RESOURCE_ALERTS_QUERY_KEY, campId, resolved, pagination],
        queryFn: () => resourceAlertService.getAlerts(campId, resolved, pagination),
        enabled: enabled && campId > 0,
    });

    return { query };
}
