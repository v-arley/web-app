import { useQuery } from "@tanstack/react-query";
import type { StockSummary } from "../schemas/stock-summary.schema";
import { stockSummaryService } from "../services/StockSummaryService";

export const STOCK_SUMMARY_QUERY_KEY = ["resource-management-modules", "inventory", "stock-summary"] as const;

export function useStockSummaryQuery(campId: number, filters?: {
    category?: string;
    status?: string;
    warehouseId?: number;
    search?: string;
}, enabled = true) {
    const query = useQuery<StockSummary[], Error>({
        queryKey: [...STOCK_SUMMARY_QUERY_KEY, campId, filters],
        queryFn: () => stockSummaryService.getStockSummary(campId, filters),
        enabled: enabled && campId > 0,
    });

    return { query };
}
