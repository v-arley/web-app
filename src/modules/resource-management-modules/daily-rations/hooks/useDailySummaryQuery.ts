import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rationDailySummaryService, type DailySummaryPersonStatus } from "../services/RationDailySummaryService";

export const DAILY_SUMMARY_QUERY_KEY = ["rations", "daily-summary"];

interface DailySummaryFilters {
    date?: string;
    page?: number;
    limit?: number;
    status?: DailySummaryPersonStatus | "";
}

export function useDailySummaryQuery(campId: number, filters?: DailySummaryFilters, enabled = true) {
    return useQuery({
        queryKey: [...DAILY_SUMMARY_QUERY_KEY, campId, filters],
        queryFn: () => rationDailySummaryService.getDailySummary(campId, filters),
        enabled: enabled && campId > 0,
        staleTime: 30_000,
    });
}

export function useCompletePendingRations(campId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (date?: string) =>
            rationDailySummaryService.completePendingRations(campId, date),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DAILY_SUMMARY_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ["rations"] });
        },
    });
}
