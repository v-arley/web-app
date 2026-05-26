import { useQuery } from "@tanstack/react-query";
import type { ResourceAlertFormValues } from "../schemas/resource-alert.schema";
import { resourceAlertService } from "../services/ResourceAlertService";

export const RESOURCE_ALERTS_QUERY_KEY = ["resource-management-modules", "inventory", "alerts"] as const;

export function useAlertsQuery(campId: number, enabled = true, resolved: "Y" | "N" = "N") {
    const query = useQuery<ResourceAlertFormValues[], Error>({
        queryKey: [...RESOURCE_ALERTS_QUERY_KEY, campId, resolved],
        queryFn: () => resourceAlertService.getAlerts(campId, resolved),
        enabled: enabled && campId > 0,
    });

    return { query };
}
