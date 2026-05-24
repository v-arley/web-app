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
    "bg-bg-tertiary border border-border-default px-3 py-2 font-mono text-[10px] text-txt-primary focus:border-accent outline-none transition-all uppercase tracking-wider w-full";

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
        <div className="px-3 py-3 border-b border-border-subtle bg-bg-secondary/30">
            <div className="flex items-end gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest">
                        Almacén
                    </label>
                    <select
                        value={selectedWarehouse ?? ""}
                        onChange={(e) => onWarehouseChange(e.target.value ? Number(e.target.value) : null)}
                        className={selectClass}
                    >
                        <option value="">TODOS LOS ALMACENES</option>
                        {warehouses.map((wh) => (
                            <option key={wh.id} value={wh.id}>{wh.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest">
                        Categoría
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className={selectClass}
                    >
                        <option value="">TODAS LAS CATEGORIAS</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest">
                        Estado de Stock
                    </label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className={selectClass}
                    >
                        <option value="">TODOS LOS ESTADOS</option>
                        <option value="OK">OK</option>
                        <option value="LOW">BAJO</option>
                        <option value="CRITICAL">CRITICO</option>
                    </select>
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="flex items-center gap-2 px-3 py-2 bg-status-critical/10 border border-status-critical/30 font-mono text-[10px] font-bold text-status-critical uppercase tracking-widest hover:bg-status-critical/20 transition-all"
                        title="Limpiar filtros"
                    >
                        <X className="h-3.5 w-3.5" />
                        Limpiar
                    </button>
                )}
            </div>
        </div>
    );
}
