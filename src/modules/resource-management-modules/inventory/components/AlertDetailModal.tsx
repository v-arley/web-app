import { AlertTriangle, CheckCircle } from "lucide-react";
import { createPortal } from "react-dom";
import type { ResourceAlertFormValues } from "../schemas/resource-alert.schema";

type Props = {
    alert: ResourceAlertFormValues;
    onClose: () => void;
    onResolve?: (alertId: number) => Promise<void>;
};

function formatDate(value?: string | null) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString("es-CR");
}

export function AlertDetailModal({ alert, onClose, onResolve }: Props) {
    const stockPercent =
        alert.min_quantity && alert.min_quantity > 0
            ? Math.min(100, Math.round((alert.current_amount / alert.min_quantity) * 100))
            : 0;

    const stockStatus =
        alert.current_amount <= 0
            ? { label: "OUT OF STOCK", color: "text-status-critical", bar: "bg-status-critical", border: "border-status-critical" }
            : alert.current_amount < alert.min_quantity
            ? { label: "LOW STOCK", color: "text-status-warning", bar: "bg-status-warning", border: "border-status-warning" }
            : { label: "NORMAL", color: "text-status-ok", bar: "bg-status-ok", border: "border-status-ok" };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative bg-bg-tertiary/90 backdrop-blur-lg w-full max-w-md border border-border-default shadow-2xl flex flex-col">
                <header className="px-5 py-4 border-b border-border-subtle bg-bg-secondary/50 shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-status-critical" />
                        <span className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-widest">
                            Alert Detail | ID : {String(alert.id ?? 0)}
                        </span>
                    </div>
                </header>

                <div className="p-5 flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-bg-secondary/40 border border-border-default p-3">
                            <div className="font-mono text-[11px] font-bold text-txt-disabled uppercase tracking-widest mb-1">Warehouse</div>
                            <div className="font-mono text-[11px] text-txt-primary uppercase">{alert.warehouse_name ?? "—"}</div>
                        </div>
                        <div className="bg-bg-secondary/40 border border-border-default p-3">
                            <div className="font-mono text-[11px] font-bold text-txt-disabled uppercase tracking-widest mb-1">Resource Code</div>
                            <div className="font-mono text-[11px] font-bold text-accent">{alert.resource_code ?? "—"}</div>
                            <div className="font-mono text-[11px] text-txt-muted mt-0.5 uppercase">{alert.resource_name}</div>
                        </div>
                    </div>

                    <div className="bg-bg-secondary/40 border border-border-default p-4">
                        <div className="font-mono text-[11px] font-bold text-txt-disabled uppercase tracking-widest mb-3">Stock Level</div>
                        <div className="flex items-end gap-4 mb-3">
                            <div>
                                <div className="font-mono text-[11px] text-txt-disabled uppercase mb-1">Current</div>
                                <div className={`app-kpi-value font-mono font-bold ${stockStatus.color}`}>{alert.current_amount}</div>
                            </div>
                            <div className="text-txt-disabled font-mono text-xl mb-1">/</div>
                            <div>
                                <div className="font-mono text-[11px] text-txt-disabled uppercase mb-1">Min. Required</div>
                                <div className="app-kpi-value font-mono font-bold text-txt-secondary">{alert.min_quantity}</div>
                            </div>
                        </div>
                        <div className="h-2 bg-bg-secondary border border-border-default overflow-hidden">
                            <div
                                className={`h-full transition-all ${stockStatus.bar}`}
                                style={{ width: `${stockPercent}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className={`font-mono text-[11px] font-bold uppercase tracking-widest ${stockStatus.color}`}>{stockStatus.label}</span>
                            <span className="font-mono text-[11px] text-txt-muted">{stockPercent}% of minimum</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-bg-secondary/40 border border-border-default p-3">
                            <div className="font-mono text-[11px] font-bold text-txt-disabled uppercase tracking-widest mb-1">Alert Triggered</div>
                            <div className="font-mono text-[11px] text-txt-secondary">{formatDate(alert.alert_date)}</div>
                        </div>
                        <div className="bg-bg-secondary/40 border border-border-default p-3">
                            <div className="font-mono text-[11px] font-bold text-txt-disabled uppercase tracking-widest mb-1">Status</div>
                            <div className={`font-mono text-[11px] font-bold ${alert.resolved === "Y" ? "text-status-ok" : "text-status-critical"}`}>
                                {alert.resolved === "Y" ? "RESOLVED" : "ACTIVE"}
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="px-5 py-4 bg-bg-secondary/30 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3">
                    <div>
                        {onResolve && alert.resolved !== "Y" && alert.id != null && (
                            <button
                                onClick={async () => {
                                    await onResolve(alert.id!);
                                    onClose();
                                }}
                                className="btn"
                            >
                                <CheckCircle size={13} />
                                MARK AS RESOLVED
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="btn"
                    >
                        CLOSE
                    </button>
                </footer>
            </div>
        </div>,
        document.body,
    );
}
