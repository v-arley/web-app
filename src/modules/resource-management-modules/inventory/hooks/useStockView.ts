import { useState } from "react";
import type { StockSummary } from "../schemas/stock-summary.schema";
import { useStockFilters } from "./useStockFilters";
import { useStockSummaryQuery } from "./useStockSummaryQuery";

export function useStockView(campId: number, enabled: boolean) {
    const [selected, setSelected] = useState<StockSummary | undefined>();

    const { query } = useStockSummaryQuery(campId, undefined, enabled);
    const filters = useStockFilters(query.data ?? []);

    const selectByIds = (warehouseId: number, resourceId: number) => {
        const record = filters.filteredRecords.find(
            (r) => r.warehouse_id === warehouseId && r.resource_id === resourceId
        );
        setSelected(record?.warehouse_id === selected?.warehouse_id && record?.resource_id === selected?.resource_id ? undefined : record);
    };

    const handleClear = () => setSelected(undefined);

    const reset = () => {
        setSelected(undefined);
        filters.setSearch("");
        filters.setCategoryFilter("");
        filters.setStatusFilter("");
        filters.setWarehouseFilter(null);
    };

    return {
        ...filters,
        selected,
        isLoading: query.isLoading,
        error: query.error,
        selectByIds,
        handleClear,
        reset,
    };
}
