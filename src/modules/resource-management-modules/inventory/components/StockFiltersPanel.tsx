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
    "rmm-input !bg-[#1c1c1c] !h-8 !border-border-strong px-3 font-mono text-[10px] text-txt-primary focus:border-accent outline-none transition-all uppercase tracking-wider w-full shadow-lg";

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
        <div className="flex items-center gap-3">
            <div className="flex-1 lg:flex-none">
                <select
                    value={selectedWarehouse ?? ""}
                    onChange={(e) => onWarehouseChange(e.target.value ? Number(e.target.value) : null)}
                    className={selectClass + " lg:min-w-[180px]"}
                    title="Warehouse"
                >
                    <option value="">WAREHOUSE: ALL_STATIONS</option>
                    {warehouses.map((wh) => (
                        <option key={wh.id} value={wh.id}>{wh.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex-1 lg:flex-none">
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className={selectClass + " lg:min-w-[160px]"}
                    title="Categoría"
                >
                    <option value="">CATEGORY: ALL_RESOURCES</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="flex-1 lg:flex-none">
                <select
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className={selectClass + " lg:min-w-[140px]"}
                    title="Estado de Stock"
                >
                    <option value="">STATUS: TOTAL_SCAN</option>
                    <option value="OK">LEVEL: NOMINAL</option>
                    <option value="LOW">LEVEL: LOW_RESERVE</option>
                    <option value="CRITICAL">LEVEL: CRITICAL_EMPT</option>
                </select>
            </div>

            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={onClear}
                    className="h-8 flex items-center gap-2 px-3 bg-status-critical/10 border border-status-critical/40 font-mono text-[9px] font-bold text-status-critical uppercase tracking-widest hover:bg-status-critical/20 transition-all shadow-md group"
                    title="Limpiar filtros"
                >
                    <X className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
                    RESET
                </button>
            )}
        </div>
    );
}
