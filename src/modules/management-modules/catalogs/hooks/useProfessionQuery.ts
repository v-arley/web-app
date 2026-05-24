import { useQuery } from "@tanstack/react-query";
import type { ProfessionFormValues } from "../schemas/profession.schema";
import { professionCatalogService } from "../services/ProfessionCatalogService";

export const PROFESSIONS_QUERY_KEY = ["management-modules", "catalogs", "professions"] as const;

export function useProfessionQuery(enabled = true) {
    const query = useQuery<ProfessionFormValues[], Error>({
        queryKey: PROFESSIONS_QUERY_KEY,
        queryFn: () => professionCatalogService.getProfessions(),
        enabled,
    });

    return { query };
}
