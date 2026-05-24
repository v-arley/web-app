import { useQuery } from "@tanstack/react-query";
import { requestResourceService } from "../services/RequestResourceService";

export const REQUEST_RESOURCES_QUERY_KEY = ["request-resources"];

export function useRequestResourcesQuery(requestId: number, enabled = true) {
    return useQuery({
        queryKey: [...REQUEST_RESOURCES_QUERY_KEY, requestId],
        queryFn: () => requestResourceService.getRequestResources(requestId),
        enabled: enabled && requestId > 0,
    });
}
