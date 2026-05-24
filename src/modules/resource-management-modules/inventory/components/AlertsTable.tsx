import { CheckCircle, Eye } from "lucide-react";
import type { ResourceAlertFormValues } from "../schemas/resource-alert.schema";

type Props = {
    alerts: ResourceAlertFormValues[];
    onResolve: (alertId: number) => Promise<void>;
    onViewDetail?: (warehouseId: number, resourceId: number) => void;
};

function formatDate(value?: string | null) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("es-CR");
}

export function AlertsTable({ alerts, onResolve, onViewDetail }: Props) {
    if (alerts.length === 0) {
        return (
            <div className="py-16 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-status-ok italic">
                ¡No hay alertas activas! Todo está bajo control.
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-[1fr_1.2fr_0.7fr_0.7fr_1fr_0.9fr] gap-2 px-4 py-2 bg-bg-tertiary text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-widest border-b border-border-default">
                {["Almacén", "Recurso", "Actual", "Mínimo", "Fecha Alerta", "Acciones"].map((header) => (
                    <div key={header}>{header}</div>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border-subtle/30 bg-bg-primary/5">
                {alerts.map((alert) => (
                    <div
                        key={alert.id ?? `${alert.warehouse_id}-${alert.resource_id}`}
                        className="grid grid-cols-[1fr_1.2fr_0.7fr_0.7fr_1fr_0.9fr] gap-2 px-4 py-3 items-center border-l-2 border-l-status-critical/50 bg-status-critical/5"
                    >
                        <div className="font-mono text-[10px] text-txt-secondary truncate">
                            {alert.warehouse_name}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="font-mono text-[10px] font-bold text-accent">{alert.resource_code}</div>
                            <div className="font-mono text-[10px] text-txt-primary truncate">{alert.resource_name}</div>
                        </div>
                        <div className="font-mono text-[11px] font-bold text-status-critical">
                            {alert.current_amount}
                        </div>
                        <div className="font-mono text-[10px] text-txt-secondary">{alert.min_quantity}</div>
                        <div className="font-mono text-[10px] text-txt-secondary">
                            {formatDate(alert.alert_date)}
                        </div>
                        <div className="flex items-center gap-2">
                            {onViewDetail && (
                                <button
                                    type="button"
                                    onClick={() => onViewDetail(alert.warehouse_id, alert.resource_id)}
                                    className="flex items-center gap-1.5 px-2 py-1.5 bg-bg-tertiary border border-border-default font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest hover:border-accent hover:text-accent transition-all"
                                    title="Ver detalle"
                                >
                                    <Eye className="h-3 w-3" />
                                </button>
                            )}
                            {alert.id != null && (
                                <button
                                    type="button"
                                    onClick={() => onResolve(alert.id!)}
                                    className="flex items-center gap-1.5 px-2 py-1.5 bg-status-ok/10 border border-status-ok/30 font-mono text-[9px] font-bold text-status-ok uppercase tracking-widest hover:bg-status-ok/20 transition-all"
                                    title="Marcar como resuelta"
                                >
                                    <CheckCircle className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
