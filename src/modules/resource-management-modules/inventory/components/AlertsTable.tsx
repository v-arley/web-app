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
            <div className="py-20 text-center relative border border-status-ok/20 bg-status-ok/5">
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
        <table className="rmm-table">
            <thead>
                <tr>
                    <th className="w-10">UID</th>
                    <th>Node/Warehouse</th>
                    <th>Resource / Code</th>
                    <th className="text-right">Actual</th>
                    <th className="text-right">Min_Cap</th>
                    <th>Trigger Date</th>
                </tr>
            </thead>
            <tbody>
                {alerts.map((alert, idx) => (
                    <tr
                        key={alert.id ?? `${alert.warehouse_id}-${alert.resource_id}`}
                        className="bg-status-critical/5 hover:bg-status-critical/10 transition-colors border-l-2 border-l-status-critical cursor-pointer select-none"
                        onDoubleClick={() => onRowDoubleClick?.(alert)}
                        title="Double-click to view detail"
                    >
                        <td>
                            <span className="font-tech text-accent opacity-50">
                                {String(alert.id || idx + 1).padStart(3, '0')}
                            </span>
                        </td>
                        <td>
                            <span className="font-mono text-txt-secondary uppercase">{alert.warehouse_name}</span>
                        </td>
                        <td>
                            <div className="flex flex-col">
                                <span className="font-mono font-bold text-accent">{alert.resource_code}</span>
                                <span className="font-mono text-[9px] text-txt-muted uppercase">{alert.resource_name}</span>
                            </div>
                        </td>
                        <td className="text-right">
                            <span className="font-mono font-bold text-status-critical text-[12px]">
                                {alert.current_amount}
                            </span>
                        </td>
                        <td className="text-right">
                            <span className="font-mono text-txt-secondary">{alert.min_quantity}</span>
                        </td>
                        <td>
                            <span className="font-mono text-[10px] text-txt-muted">
                                {formatDate(alert.alert_date)}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
