import { useQuery } from "@tanstack/react-query";
import type { ResourceFormValues } from "../schemas/resource.schema";
import { resourceCatalogService } from "../services/ResourceCatalogService";

export const RESOURCES_QUERY_KEY = ["management-modules", "catalogs", "resources"] as const;

export function useResourceQuery(enabled = true) {
    const query = useQuery<ResourceFormValues[], Error>({
        queryKey: RESOURCES_QUERY_KEY,
        queryFn: () => resourceCatalogService.getResources(),
        enabled,
    });

    return { query };
}
