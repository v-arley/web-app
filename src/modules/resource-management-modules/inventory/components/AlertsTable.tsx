import type { ResourceAlertFormValues } from "../schemas/resource-alert.schema";

type Props = {
    alerts: ResourceAlertFormValues[];
    onRowDoubleClick?: (alert: ResourceAlertFormValues) => void;
};

function formatDate(value?: string | null) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("es-CR");
}

export function AlertsTable({ alerts = [], onRowDoubleClick }: Props) {
    if (alerts.length === 0) {
        return (
            <div className="relative flex h-full min-h-64 items-center justify-center border border-status-ok/20 bg-status-ok/5 text-center">
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                    <span className="font-mono text-[80px] font-bold text-status-ok">SAFE</span>
                </div>
                <div className="relative z-10 font-mono text-[11px] uppercase tracking-[0.3em] text-status-ok">
                    No active criticalities detected in sector
                </div>
            </div>
        );
    }

    return (
        <div className="app-table-wrap">
            <table className="app-table">
                <thead>
                    <tr>
                        <th>UID</th>
                        {/* <th>Node/Warehouse</th> */}
                        <th>Resource / Code</th>
                        <th style={{ textAlign: "right" }}>Actual</th>
                        <th style={{ textAlign: "right" }}>Min_Cap</th>
                        <th>Trigger Date</th>
                    </tr>
                </thead>
                <tbody className="app-stagger-rows">
                    {alerts.map((alert, idx) => (
                        <tr
                            key={alert.id ?? `${alert.warehouse_id}-${alert.resource_id}`}
                            className="app-table-row select-none border-l-2 border-l-status-critical bg-status-critical/5 hover:bg-status-critical/10"
                            onDoubleClick={() => onRowDoubleClick?.(alert)}
                            title="Double-click to view detail"
                        >
                            <td className="app-table-cell--code opacity-50">
                                {String(alert.id || idx + 1).padStart(3, '0')}
                            </td>
                            {/* <td className="app-table-cell--time uppercase">
                                {alert.warehouse_name}
                            </td> */}
                            <td>
                                <div className="flex flex-col">
                                    <span className="app-table-cell--code text-accent">{alert.resource_code}</span>
                                    <span className="font-mono text-[9px] text-txt-muted uppercase">{alert.resource_name}</span>
                                </div>
                            </td>
                            <td className="app-table-cell--number">
                                <span className="font-bold text-status-critical">
                                    {alert.current_amount}
                                </span>
                            </td>
                            <td className="app-table-cell--number text-txt-secondary">
                                {alert.min_quantity}
                            </td>
                            <td className="app-table-cell--time">
                                {formatDate(alert.alert_date)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
