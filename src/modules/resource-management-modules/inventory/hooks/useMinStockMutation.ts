import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MinStockConfigFormValues } from "../schemas/min-stock-config.schema";
import { minStockConfigService } from "../services/MinStockConfigService";
import { STOCK_SUMMARY_QUERY_KEY } from "./useStockSummaryQuery";

export function useMinStockMutation() {
    const queryClient = useQueryClient();

    const update = useMutation({
        mutationFn: (data: MinStockConfigFormValues) => minStockConfigService.updateMinStock(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STOCK_SUMMARY_QUERY_KEY });
        },
    });

    return { update };
}
