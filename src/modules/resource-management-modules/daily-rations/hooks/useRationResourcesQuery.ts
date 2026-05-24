import { useQuery } from "@tanstack/react-query";
import { rationResourceService } from "../services/RationResourceService";

export const RATION_RESOURCES_QUERY_KEY = ["ration-resources"];

export function useRationResourcesQuery(rationId: number, enabled = true) {
    return useQuery({
        queryKey: [...RATION_RESOURCES_QUERY_KEY, rationId],
        queryFn: () => rationResourceService.getRationResources(rationId),
        enabled: enabled && rationId > 0,
    });
}
