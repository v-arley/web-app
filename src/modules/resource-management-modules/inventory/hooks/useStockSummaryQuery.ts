import { useQuery } from "@tanstack/react-query";
import type { StockSummary } from "../schemas/stock-summary.schema";
import { stockSummaryService, type StockSummaryFacets, type StockSummaryFilters } from "../services/StockSummaryService";
import type { PaginatedResult } from "../../../../shared/utils/Response";

export const STOCK_SUMMARY_QUERY_KEY = ["resource-management-modules", "inventory", "stock-summary"] as const;

export function useStockSummaryQuery(campId: number, filters?: StockSummaryFilters, enabled = true) {
    const query = useQuery<PaginatedResult<StockSummary, StockSummaryFacets>, Error>({
        queryKey: [...STOCK_SUMMARY_QUERY_KEY, campId, filters],
        queryFn: () => stockSummaryService.getStockSummary(campId, filters),
        enabled: enabled && campId > 0,
    });

    return { query };
}
