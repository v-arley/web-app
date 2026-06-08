import { useSystemCrud } from "../../shared/hooks/useSystemCrud";
import { resourceCatalogService } from "../services/resourceCatalogService";
import type { ResourceCatalogFormValues, ResourceCatalogRecord, ResourceCatalogUpdateValues } from "../schemas/resource.schema";

export const RESOURCE_CATALOG_QUERY_KEY = ["system-management-modules", "catalogs", "resources"] as const;

export function useResourceCatalog() {
    return useSystemCrud<ResourceCatalogRecord, ResourceCatalogFormValues, ResourceCatalogUpdateValues>(
        RESOURCE_CATALOG_QUERY_KEY,
        resourceCatalogService,
    );
}
