import { useQuery } from "@tanstack/react-query";
import type { CampRecord } from "../schemas/camp.schema";
import { campService } from "../services/campService";

export const CAMPS_QUERY_KEY = ["management-modules", "camps", "create-camp", "camps"] as const;

export function useCampQuery(search = "", enabled = true) {
    const normalizedSearch = search.trim();

    const query = useQuery<CampRecord[], Error>({
        queryKey: [...CAMPS_QUERY_KEY, normalizedSearch],
        queryFn: () => campService.getCamps(normalizedSearch),
        enabled,
    });

    return { query };
}
