import type { StockSummary } from "../schemas/stock-summary.schema";
import { StockStatusBadge } from "./StockStatusBadge";

type Props = {
    stocks: StockSummary[];
    selectedWarehouseId: number | null;
    selectedResourceId: number | null;
    onSelect: (warehouseId: number, resourceId: number) => void;
};

export function StockTable({ stocks = [], selectedWarehouseId, selectedResourceId, onSelect }: Props) {
    if (stocks.length === 0) {
        return (
            <div className="py-20 text-center relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                    <span className="font-mono text-[80px] font-bold">EMPTY</span>
                </div>
                <div className="relative z-10 font-mono text-[11px] uppercase tracking-[0.3em] text-txt-muted">
                    No records found in current storage node
                </div>
            </div>
        );
    }

    return (
        <table className="rmm-table">
            <thead>
                <tr>
                    <th className="w-8">#</th>
                    <th>Warehouse</th>
                    <th>Resource</th>
                    <th className="text-right">Quantity</th>
                    <th className="text-right">Minimum</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {stocks.map((record, idx) => {
                    const isSelected =
                        record.warehouse_id === selectedWarehouseId &&
                        record.resource_id === selectedResourceId;
                    
                    return (
                        <tr 
                            key={`${record.warehouse_id}-${record.resource_id}`}
                            onClick={() => onSelect(record.warehouse_id, record.resource_id)}
                            className={`cursor-pointer transition-colors ${isSelected ? 'bg-accent/10' : ''}`}
                        >
                            <td>
                                <span className="font-tech text-accent opacity-50">{String(idx + 1).padStart(2, '0')}</span>
                            </td>
                            <td>
                                <div className="font-mono uppercase text-txt-primary">
                                    {record.warehouse_name}
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <span className="font-mono font-bold uppercase">{record.resource_name}</span>
                                    <span className="font-mono text-[9px] text-txt-muted opacity-70">ID: {record.resource_id}</span>
                                </div>
                            </td>
                            <td className="text-right">
                                <span className="font-mono font-bold text-txt-primary">
                                    {record.current_amount} <span className="text-[9px] text-txt-muted">{record.unit_of_measure}</span>
                                </span>
                            </td>
                            <td className="text-right font-mono">
                                {record.min_quantity}
                            </td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <StockStatusBadge status={record.stock_status} size="sm" />
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}


