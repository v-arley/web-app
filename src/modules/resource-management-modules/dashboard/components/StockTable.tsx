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

export function StockTable({ items, isLoading }: StockTableProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="h-4 w-4 animate-spin border-2 border-accent border-t-transparent rounded-full" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-txt-disabled">
                <PackageOpen size={32} className="mb-2 opacity-40" />
                <p className="text-[11px] font-mono uppercase tracking-widest">Sin registros</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-border-default bg-bg-primary/30">
                        <th className="text-left py-3 px-4 text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-[0.15em]">
                            Recurso
                        </th>
                        <th className="text-right py-3 px-4 text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-[0.15em]">
                            Cantidad
                        </th>
                        <th className="text-right py-3 px-4 text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-[0.15em]">
                            Mínimo
                        </th>
                        <th className="text-center py-3 px-4 text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-[0.15em]">
                            Estado
                        </th>
                        <th className="text-left py-3 px-4 text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-[0.15em]">
                            Último Movimiento
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr
                            key={`${item.resource_code}-${index}`}
                            className="border-b border-border-default/50 hover:bg-bg-primary/20 transition-colors"
                        >
                            <td className="py-3 px-4">
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-mono font-bold text-accent">
                                        {item.resource_code}
                                    </span>
                                    <span className="text-[10px] font-mono text-txt-secondary">
                                        {item.resource_name}
                                    </span>
                                </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                                <span className="text-[12px] font-mono font-bold text-txt-primary">
                                    {item.amount}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                                <span className="text-[11px] font-mono text-txt-secondary">
                                    {item.min_quantity}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                                <span
                                    className={`inline-block px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest border ${
                                        item.stock_status === "CRITICAL"
                                            ? "bg-status-critical/10 border-status-critical/30 text-status-critical"
                                            : item.stock_status === "LOW"
                                            ? "bg-status-warning/10 border-status-warning/30 text-status-warning"
                                            : "bg-status-ok/10 border-status-ok/30 text-status-ok"
                                    }`}
                                >
                                    {item.stock_status}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span className="text-[10px] font-mono text-txt-secondary">
                                    {new Date(item.date_last_movement).toLocaleString("es-ES", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
