import { useDeferredValue, useMemo, useState } from "react";
import type { StockSummary } from "../schemas/stock-summary.schema";

function toSearchText(record: StockSummary) {
    return [
        record.resource_code,
        record.resource_name,
        record.warehouse_name,
        record.category,
    ]
        .join(" ")
        .toLowerCase();
}

export function useStockFilters(records: StockSummary[]) {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [warehouseFilter, setWarehouseFilter] = useState<number | null>(null);

    const deferredSearch = useDeferredValue(search);

    const filteredRecords = useMemo(() => {
        let filtered = records;

        // Aplicar filtro de búsqueda
        const query = deferredSearch.trim().toLowerCase();
        if (query) {
            filtered = filtered.filter((record) => toSearchText(record).includes(query));
        }

        // Aplicar filtro de categoría
        if (categoryFilter) {
            filtered = filtered.filter((record) => record.category === categoryFilter);
        }

        // Aplicar filtro de estado
        if (statusFilter) {
            filtered = filtered.filter((record) => record.stock_status === statusFilter);
        }

        // Aplicar filtro de almacén
        if (warehouseFilter) {
            filtered = filtered.filter((record) => record.warehouse_id === warehouseFilter);
        }

        return filtered;
    }, [deferredSearch, records, categoryFilter, statusFilter, warehouseFilter]);

    // Obtener opciones únicas para los filtros
    const categories = useMemo(() => {
        const unique = new Set(records.map((r) => r.category));
        return Array.from(unique).sort();
    }, [records]);

    const warehouses = useMemo(() => {
        const unique = new Map<number, string>();
        records.forEach((r) => unique.set(r.warehouse_id, r.warehouse_name));
        return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
    }, [records]);

    return {
        search,
        setSearch,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        warehouseFilter,
        setWarehouseFilter,
        filteredRecords,
        categories,
        warehouses,
    };
}
