import { useDeferredValue, useState } from "react";
import type { StockSummary } from "../schemas/stock-summary.schema";
import { useStockSummaryQuery } from "./useStockSummaryQuery";

export function useStockView(campId: number, enabled: boolean) {
    const [selected, setSelected] = useState<StockSummary | undefined>();
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [warehouseFilter, setWarehouseFilter] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 50;
    const deferredSearch = useDeferredValue(search);

    const { query } = useStockSummaryQuery(campId, {
        search: deferredSearch.trim() || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        warehouseId: warehouseFilter ?? undefined,
        page,
        limit: pageSize,
    }, enabled);

    const records = query.data?.items ?? [];
    const pagination = query.data?.pagination ?? {
        page,
        limit: pageSize,
        total: 0,
        totalPages: 1,
    };
    const categories = query.data?.facets?.categories ?? [];
    const warehouses = query.data?.facets?.warehouses ?? [];

    const selectByIds = (warehouseId: number, resourceId: number) => {
        const record = records.find(
            (r) => r.warehouse_id === warehouseId && r.resource_id === resourceId
        );
        setSelected(record?.warehouse_id === selected?.warehouse_id && record?.resource_id === selected?.resource_id ? undefined : record);
    };

    const handleClear = () => setSelected(undefined);

    const reset = () => {
        setSelected(undefined);
        setSearch("");
        setCategoryFilter("");
        setStatusFilter("");
        setWarehouseFilter(null);
        setPage(1);
    };

    return {
        search,
        setSearch,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        warehouseFilter,
        setWarehouseFilter,
        filteredRecords: records,
        categories,
        warehouses,
        page: pagination.page,
        setPage,
        pageSize: pagination.limit,
        totalPages: pagination.totalPages,
        totalRecords: pagination.total,
        selected,
        isLoading: query.isLoading,
        error: query.error,
        selectByIds,
        handleClear,
        reset,
    };
}
