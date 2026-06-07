import { PackageOpen } from "lucide-react";

interface StockItem {
    resource_code: string;
    resource_name: string;
    amount: number;
    min_quantity: number;
    stock_status: "OK" | "LOW" | "CRITICAL";
    date_last_movement: string;
}

interface StockTableProps {
    items: StockItem[];
    isLoading?: boolean;
}

export function StockTable({ items = [], isLoading }: StockTableProps) {
    if (isLoading) {
        return (
            <div className="flex h-40 items-center justify-center bg-bg-secondary/10">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-5 w-5 border-2 border-accent border-t-transparent animate-spin" />
                    <span className="font-mono text-[9px] text-txt-muted uppercase tracking-[0.2em]">Retrieving telemetry...</span>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="py-16 text-center border border-border-default/50 bg-bg-secondary/5">
                <PackageOpen size={24} className="mx-auto mb-3 text-txt-disabled opacity-30" />
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-txt-muted">NO DATA AVAILABLE</p>
            </div>
        );
    }

    return (
        <table className="rmm-table">
            <thead className="">
                <tr>
                    <th className="">RESOURCE_ID / CODE</th>
                    <th className="">QTY</th>
                    <th className="">LIMIT</th>
                    <th className="">STATUS</th>
                    <th className="">LAST_EVENT</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => (
                    <tr key={`${item.resource_code}-${index}`}>
                        <td>
                            <div className="flex flex-col">
                                <span className="font-tech text-accent text-[11px] tracking-widest">{item.resource_code}</span>
                                <span className="font-mono font-bold text-txt-primary uppercase text-[11px]">{item.resource_name}</span>
                            </div>
                        </td>
                        <td>
                            <span className="font-mono font-bold text-txt-primary text-[11px]">{item.amount}</span>
                        </td>
                        <td>
                            <span className="font-mono text-txt-secondary text-[11px]">{item.min_quantity}</span>
                        </td>
                        <td>
                            <span
                                className={`inline-block px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-tighter ${
                                    item.stock_status === "CRITICAL"
                                        ? "text-status-critical"
                                        : item.stock_status === "LOW"
                                        ? "text-status-warning"
                                        : "text-[#08DC86]"
                                }`}
                            >
                                {item.stock_status}
                            </span>
                        </td>
                        <td>
                            <span className="font-mono text-[11px] text-txt-muted">
                                {new Date(item.date_last_movement).toISOString().split('T')[0]}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}