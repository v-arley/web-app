import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resourceAlertService } from "../services/ResourceAlertService";
import { RESOURCE_ALERTS_QUERY_KEY } from "./useAlertsQuery";
import { STOCK_SUMMARY_QUERY_KEY } from "./useStockSummaryQuery";

export function useAlertMutation() {
    const queryClient = useQueryClient();

    const resolve = useMutation({
        mutationFn: (alertId: number) => resourceAlertService.resolveAlert(alertId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RESOURCE_ALERTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: STOCK_SUMMARY_QUERY_KEY });
        },
    });

    return { resolve };
}
