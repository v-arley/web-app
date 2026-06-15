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

const STOCK_BADGE: Record<string, string> = {
    CRITICAL: "app-table-badge--error",
    LOW:      "app-table-badge--warn",
    OK:       "app-table-badge--ok",
};

export function StockTable({ items = [], isLoading }: StockTableProps) {
    if (isLoading) {
        return (
            <div className="app-loading-state app-animate-fade" style={{ flexDirection: "column", gap: "0.5rem" }}>
                <div className="app-spinner" />
                <span className="app-eyebrow" style={{ letterSpacing: "0.25em" }}>Retrieving telemetry...</span>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="app-empty-state app-animate-fade">
                <PackageOpen size={24} />
                <span>No data available</span>
            </div>
        );
    }

    return (
        <div className="app-table-wrap">
            <table className="app-table">
                <thead>
                    <tr>
                        <th>Resource / Code</th>
                        <th>Qty</th>
                        <th>Limit</th>
                        <th>Status</th>
                        <th>Last Event</th>
                    </tr>
                </thead>
                <tbody className="app-stagger-rows">
                    {items.map((item, index) => (
                        <tr key={`${item.resource_code}-${index}`}>
                            <td>
                                <div className="flex flex-col">
                                    <span className="app-table-cell--code text-accent">{item.resource_code}</span>
                                    <span className="app-table-cell--primary uppercase">{item.resource_name}</span>
                                </div>
                            </td>
                            <td className="app-table-cell--primary app-table-cell--number">{item.amount}</td>
                            <td className="app-table-cell--time app-table-cell--number">{item.min_quantity}</td>
                            <td>
                                <span className={`app-table-badge ${STOCK_BADGE[item.stock_status] ?? "app-table-badge--info"}`}>
                                    {item.stock_status}
                                </span>
                            </td>
                            <td className="app-table-cell--time">
                                {new Date(item.date_last_movement).toISOString().split('T')[0]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
