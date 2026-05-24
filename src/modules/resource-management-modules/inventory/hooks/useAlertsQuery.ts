import { useQuery } from "@tanstack/react-query";
import type { ResourceAlertFormValues } from "../schemas/resource-alert.schema";
import { resourceAlertService } from "../services/ResourceAlertService";

export const RESOURCE_ALERTS_QUERY_KEY = ["resource-management-modules", "inventory", "alerts"] as const;

export function useAlertsQuery(campId: number, enabled = true) {
    const query = useQuery<ResourceAlertFormValues[], Error>({
        queryKey: [...RESOURCE_ALERTS_QUERY_KEY, campId],
        queryFn: () => resourceAlertService.getAlerts(campId),
        enabled: enabled && campId > 0,
    });

    return { query };
}
