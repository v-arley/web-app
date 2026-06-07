import { useSystemCrud } from "../../shared/hooks/useSystemCrud";
import { professionCatalogService } from "../services/professionCatalogService";
import type { ProfessionCatalogFormValues, ProfessionCatalogRecord, ProfessionCatalogUpdateValues } from "../schemas/profession.schema";

export const PROFESSION_CATALOG_QUERY_KEY = ["system-management-modules", "catalogs", "professions"] as const;

export function useProfessionCatalog() {
    return useSystemCrud<ProfessionCatalogRecord, ProfessionCatalogFormValues, ProfessionCatalogUpdateValues>(
        PROFESSION_CATALOG_QUERY_KEY,
        professionCatalogService,
    );
}
