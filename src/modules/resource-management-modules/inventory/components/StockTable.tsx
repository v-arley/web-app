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
            <div className="app-empty-state app-animate-fade h-full min-h-64">
                <span>No records found in current storage node</span>
            </div>
        );
    }

    return (
        <div className="app-table-wrap">
        <table className="app-table">
            <thead>
                <tr>
                    <th>Resource</th>
                    {/* <th>Warehouse</th> */}
                    <th>Quantity</th>
                    <th>Minimum</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody className="app-stagger-rows">
                {stocks.map((record) => {
                    const isSelected =
                        record.warehouse_id === selectedWarehouseId &&
                        record.resource_id === selectedResourceId;

                    let statusBadge = "app-table-badge--info";
                    if (record.stock_status === "LOW") statusBadge = "app-table-badge--warn";
                    else if (record.stock_status === "OK") statusBadge = "app-table-badge--ok";
                    else if (record.stock_status === "CRITICAL") statusBadge = "app-table-badge--error";

                    return (
                        <tr 
                            key={`${record.warehouse_id}-${record.resource_id}`}
                            onClick={() => onSelect(record.warehouse_id, record.resource_id)}
                            className={`app-table-row ${isSelected ? "app-table-row--selected" : ""}`}
                        >
                            <td>
                                <div className="flex flex-col justify-start items-start">
                                    <span className="app-table-cell--primary">{record.resource_name}</span>
                                    <span className="app-table-cell--code">ID: {record.resource_id}</span>
                                </div>
                            </td> 
                            {/* <td className="app-table-cell--primary">
                                {record.warehouse_name}
                            </td> */}
                            <td>
                                <span className="app-table-cell--number">
                                    {record.current_amount}
                                </span>
                            </td>
                            <td className="app-table-cell--time">{record.min_quantity}</td>
                            <td>
                                <span className={`app-table-badge ${statusBadge}`}>
                                    {record.stock_status}
                                </span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        </div>
    );
}
