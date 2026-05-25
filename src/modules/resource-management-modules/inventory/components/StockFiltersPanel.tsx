import { X } from "lucide-react";

type Props = {
    categories: string[];
    warehouses: { id: number; name: string }[];
    selectedCategory: string;
    selectedStatus: string;
    selectedWarehouse: number | null;
    onCategoryChange: (category: string) => void;
    onStatusChange: (status: string) => void;
    onWarehouseChange: (warehouseId: number | null) => void;
    onClear: () => void;
};

const selectClass =
    "h-6 bg-bg-app border border-border-default px-2 font-mono text-[9px] text-txt-primary focus:border-accent outline-none transition-all uppercase tracking-wider w-full";

export function StockFiltersPanel({
    categories,
    warehouses,
    selectedCategory,
    selectedStatus,
    selectedWarehouse,
    onCategoryChange,
    onStatusChange,
    onWarehouseChange,
    onClear,
}: Props) {
    const hasActiveFilters = selectedCategory || selectedStatus || selectedWarehouse;

    return (
        <div className="flex items-center gap-2">
            <select
                value={selectedWarehouse ?? ""}
                onChange={(e) => onWarehouseChange(e.target.value ? Number(e.target.value) : null)}
                className={selectClass + " min-w-35"}
                title="Warehouse"
            >
                <option value="">WAREHOUSE: TODOS</option>
                {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>{wh.name}</option>
                ))}
            </select>

            <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className={selectClass + " min-w-30"}
                title="Categoría"
            >
                <option value="">CATEGORÍA: TODA</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className={selectClass + " min-w-27"}
                title="Estado de Stock"
            >
                <option value="">STOCK: TODO</option>
                <option value="OK">OK</option>
                <option value="LOW">BAJO</option>
                <option value="CRITICAL">CRÍTICO</option>
            </select>

            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={onClear}
                    className="h-6 flex items-center gap-1.5 px-2 bg-status-critical/10 border border-status-critical/30 font-mono text-[9px] font-bold text-status-critical uppercase tracking-widest hover:bg-status-critical/20 transition-all"
                    title="Limpiar filtros"
                >
                    <X className="h-3 w-3" />
                    CLR
                </button>
            )}
        </div>
    );
}
