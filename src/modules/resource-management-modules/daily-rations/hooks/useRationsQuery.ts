import { useQuery } from "@tanstack/react-query";
import { rationService } from "../services/RationService";

export const RATIONS_QUERY_KEY = ["rations"];

interface RationsFilters {
    startDate?: string;
    endDate?: string;
    completed?: 'Y' | 'N';
}

export function useRationsQuery(
    campId: number,
    filters?: RationsFilters,
    enabled = true
) {
    return useQuery({
        queryKey: [...RATIONS_QUERY_KEY, campId, filters],
        queryFn: () => rationService.getRations(campId, filters),
        enabled: enabled && campId > 0,
    });
}

export function useRationByIdQuery(rationId: number, enabled = true) {
    return useQuery({
        queryKey: [...RATIONS_QUERY_KEY, rationId],
        queryFn: () => rationService.getRationById(rationId),
        enabled: enabled && rationId > 0,
    });
}
