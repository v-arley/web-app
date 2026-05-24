import type { StockSummary } from "../schemas/stock-summary.schema";
import { StockStatusBadge } from "./StockStatusBadge";

type Props = {
    stocks: StockSummary[];
    selectedWarehouseId: number | null;
    selectedResourceId: number | null;
    onSelect: (warehouseId: number, resourceId: number) => void;
};

function formatDate(value?: string | null) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("es-CR", { dateStyle: "short" });
}

export function StockTable({ stocks, selectedWarehouseId, selectedResourceId, onSelect }: Props) {
    if (stocks.length === 0) {
        return (
            <div className="py-16 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-txt-disabled italic">
                No hay datos de inventario disponibles.
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-[1fr_1.2fr_0.9fr_0.7fr_0.7fr_0.7fr_0.8fr_0.7fr] gap-2 px-4 py-2 bg-bg-tertiary text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-widest border-b border-border-default">
                {["Almacén", "Recurso", "Categoría", "Actual", "Mínimo", "Unidad", "Estado", "Últ. Mov."].map((header) => (
                    <div key={header}>{header}</div>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border-subtle/30 bg-bg-primary/5">
                {stocks.map((record) => {
                    const isSelected =
                        record.warehouse_id === selectedWarehouseId &&
                        record.resource_id === selectedResourceId;
                    return (
                        <button
                            key={`${record.warehouse_id}-${record.resource_id}`}
                            type="button"
                            onClick={() => onSelect(record.warehouse_id, record.resource_id)}
                            className={`grid grid-cols-[1fr_1.2fr_0.9fr_0.7fr_0.7fr_0.7fr_0.8fr_0.7fr] gap-2 px-4 py-3 w-full items-center text-left transition-all ${
                                isSelected
                                    ? "bg-accent/10 border-l-2 border-l-accent"
                                    : "hover:bg-bg-selected border-l-2 border-l-transparent"
                            }`}
                        >
                            <div className="font-mono text-[10px] text-txt-secondary truncate">
                                {record.warehouse_name}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <div className="font-mono text-[10px] font-bold text-accent">{record.resource_code}</div>
                                <div className="font-mono text-[10px] text-txt-primary truncate">{record.resource_name}</div>
                            </div>
                            <div className="font-mono text-[10px] text-txt-secondary truncate">{record.category}</div>
                            <div className="font-mono text-[11px] font-bold text-txt-primary">{record.current_amount}</div>
                            <div className="font-mono text-[10px] text-txt-secondary">{record.min_quantity}</div>
                            <div className="font-mono text-[10px] text-txt-secondary">{record.unit_of_measure}</div>
                            <StockStatusBadge status={record.stock_status} size="sm" />
                            <div className="font-mono text-[9px] text-txt-disabled">{formatDate(record.date_last_movement)}</div>
                        </button>
                    );
                })}
            </div>
        </>
    );
}
