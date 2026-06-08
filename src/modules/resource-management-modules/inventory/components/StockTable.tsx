import type { StockSummary } from "../schemas/stock-summary.schema";

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
            <thead className="">
                <tr>
                    <th className="">Resource</th>
                    <th className="">Warehouse</th>
                    <th className="">Quantity</th>
                    <th className="">Minimum</th>
                    <th className="">Status</th>
                </tr>
            </thead>
            <tbody>
                {stocks.map((record) => {
                    const isSelected =
                        record.warehouse_id === selectedWarehouseId &&
                        record.resource_id === selectedResourceId;
                    
                    return (
                        <tr 
                            key={`${record.warehouse_id}-${record.resource_id}`}
                            onClick={() => onSelect(record.warehouse_id, record.resource_id)}
                            className="bg-status-critical/5 hover:bg-status-critical/10 transition-colors border-l-2 border-l-status-critical cursor-pointer select-none"
                        >
                            <td>
                                <div className="flex flex-col justify-start items-start">
                                    <span className="font-mono font-bold uppercase">{record.resource_name}</span>
                                    <span className="font-mono text-[11px] text-accent opacity-70">ID: {record.resource_id}</span>
                                </div>
                            </td> 
                            <td>
                                <div className="font-mono uppercase text-txt-primary">
                                    {record.warehouse_name}
                                </div>
                            </td>
                            
                            <td>
                                <span className="font-mono font-bold text-txt-primary">
                                    {record.current_amount} <span className="text-[11px] text-txt-muted">{record.unit_of_measure}</span>
                                </span>
                            </td>
                            <td>
                                <span className="font-mono text-[11px] text-txt-muted">{record.min_quantity}</span>
                            </td>
                            <td className="table-system-td table-system-td--primary">
                                <div className="flex items-center justify-center gap-2">
                                    {
                                        record.stock_status === "LOW" && (
                                            <span className="text-[#CC361E]">
                                                {record.stock_status}
                                            </span>
                                        )
                                    }
                                    {
                                        record.stock_status === "OK" && (
                                            <span className="text-[#08DC86]">
                                                {record.stock_status}
                                            </span>
                                        )
                                    }
                                    {
                                        record.stock_status === "CRITICAL" && (
                                            <span className="text-[#FF1636]">
                                                {record.stock_status}
                                            </span>
                                        )
                                    }
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}


