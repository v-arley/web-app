import { CheckCircle, Package, Play, Truck, XCircle } from "lucide-react";
import type { ShipmentFormValues } from "../schemas/shipment.schema";
import { useRequestResourcesQuery } from "../hooks/useRequestResourcesQuery";
import { useQuery } from "@tanstack/react-query";
import { ResourceService } from "../../../../services/ResourceService";
import type { Resource } from "../../../../models/Resource";

const resourceService = new ResourceService();

interface Props {
    shipment: ShipmentFormValues;
    onClose: () => void;
    onStartTransit?: (id: number) => void;
    onConfirmDelivery?: (id: number) => void;
    onCancel?: (id: number) => void;
    isLoading?: boolean;
}

function formatDate(value?: string | null) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("es-CR", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
    P: { label: "PENDING",    color: "text-status-warning", bg: "bg-status-warning/10", border: "border-status-warning/30" },
    I: { label: "IN TRANSIT", color: "text-accent",         bg: "bg-accent/10",         border: "border-accent/30" },
    D: { label: "DELIVERED",  color: "text-status-ok",      bg: "bg-status-ok/10",      border: "border-status-ok/30" },
    C: { label: "CANCELLED",  color: "text-status-critical", bg: "bg-status-critical/10", border: "border-status-critical/30" },
};

export function ShipmentDetailModal({ shipment, onClose, onStartTransit, onConfirmDelivery, onCancel, isLoading }: Props) {
    const meta = STATUS_META[shipment.status] ?? STATUS_META["P"];
    const id = shipment.id;
    const requestId = shipment.request_id;
    const senderLabel = shipment.request?.origin_camp?.code || shipment.request?.origin_camp?.description || "UNRESOLVED CAMP";
    const receiverLabel = shipment.request?.destination_camp?.code || shipment.request?.destination_camp?.description || "UNRESOLVED CAMP";

    const { data: resources = [], isLoading: resourcesLoading } = useRequestResourcesQuery(requestId);

    const { data: availableResources = [] } = useQuery({
        queryKey: ["resources-list"],
        queryFn: async () => {
            const res = await resourceService.findAll();
            return res.getResultado<Resource[]>("registros") ?? [];
        }
    });

    const getResourceName = (resourceId: number) => {
        return availableResources.find((r) => r.id === resourceId)?.name || `ID: ${resourceId}`;
    };

    function handleClose() {
        if (!isLoading) onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div className="relative w-full max-w-4xl bg-bg-tertiary/90 backdrop-blur-lg border border-border-strong shadow-2xl flex flex-col md:flex-row max-h-[85vh]">
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="px-5 py-4 border-b border-border-subtle bg-bg-secondary/50 shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-0.5 self-stretch bg-accent" />
                            <Package size={16} className="text-accent" />
                            <div>
                                <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-widest">
                                    SHIPMENT DETAIL
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
                        <div className="flex items-center justify-center gap-3">
                            <span className="font-mono text-[11px] text-txt-disabled uppercase tracking-widest w-24">STATUS</span>
                            <span className={`px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest ${meta.color}`}>
                                {meta.label}
                            </span>
                        </div>

                        <div className="border-t border-border-subtle" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                            <div>
                                <div className="font-mono text-[11px] text-txt-disabled uppercase tracking-widest mb-1">Sender</div>
                                <div className="font-mono text-[11px] font-bold text-txt-primary">
                                    {senderLabel}
                                </div>
                            </div>
                            <div>
                                <div className="font-mono text-[11px] text-txt-disabled uppercase tracking-widest mb-1">Receiver</div>
                                <div className="font-mono text-[11px] font-bold text-txt-primary">
                                    {receiverLabel}
                                </div>
                            </div>
                            <div>
                                <div className="font-mono text-[11px] text-txt-disabled uppercase tracking-widest mb-1">Shipment ID</div>
                                <div className="font-mono text-[11px] font-bold text-txt-primary">
                                    {String(shipment.id ?? 0)}
                                </div>
                            </div>
                            <div>
                                <div className="font-mono text-[11px] text-txt-disabled uppercase tracking-widest mb-1">Request ID</div>
                                <div className="font-mono text-[11px] font-bold text-accent">
                                    {String(shipment.request_id)}
                                </div>
                            </div>
                            <div>
                                <div className="font-mono text-[11px] text-txt-disabled uppercase tracking-widest mb-1">Departure Date</div>
                                <div className="font-mono text-[11px] text-txt-secondary">
                                    {formatDate(shipment.departure_date)}
                                </div>
                            </div>
                            <div>
                                <div className="font-mono text-[11px] text-txt-disabled uppercase tracking-widest mb-1">Arrival Date</div>
                                <div className="font-mono text-[11px] text-txt-secondary">
                                    {formatDate(shipment.arrival_date)}
                                </div>
                            </div>
                        </div>

                        {shipment.observations && (
                            <>
                                <div className="border-t border-border-subtle" />
                                <div>
                                    <div className="font-mono text-[11px] text-txt-disabled uppercase tracking-widest mb-1.5">Observations</div>
                                    <p className="font-mono text-[11px] text-txt-secondary leading-relaxed bg-bg-secondary/40 px-3 py-2 border border-border-subtle">
                                        {shipment.observations}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    <footer className="px-5 py-4 bg-bg-secondary/30 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 shrink-0">
                        <div className="flex flex-wrap items-center gap-2">
                            {shipment.status === "P" && id != null && (
                                <>
                                    {onStartTransit && (
                                        <button
                                            onClick={() => { onStartTransit(id); onClose(); }}
                                            disabled={isLoading}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-accent/10 border border-accent/40 font-mono text-[10px] font-bold text-accent uppercase tracking-widest hover:bg-accent/20 transition-all disabled:opacity-50"
                                        >
                                            <Play size={12} />
                                            START TRANSIT
                                        </button>
                                    )}
                                    {onCancel && (
                                        <button
                                            onClick={() => { onCancel(id); onClose(); }}
                                            disabled={isLoading}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-status-critical/10 border border-status-critical/40 font-mono text-[10px] font-bold text-status-critical uppercase tracking-widest hover:bg-status-critical/20 transition-all disabled:opacity-50"
                                        >
                                            <XCircle size={12} />
                                            CANCEL
                                        </button>
                                    )}
                                </>
                            )}

                            {shipment.status === "I" && id != null && (
                                <>
                                    {onConfirmDelivery && (
                                        <button
                                            onClick={() => { onConfirmDelivery(id); onClose(); }}
                                            disabled={isLoading}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-status-ok/10 border border-status-ok/40 font-mono text-[10px] font-bold text-status-ok uppercase tracking-widest hover:bg-status-ok/20 transition-all disabled:opacity-50"
                                        >
                                            <CheckCircle size={12} />
                                            CONFIRM DELIVERY
                                        </button>
                                    )}
                                    {onCancel && (
                                        <button
                                            onClick={() => { onCancel(id); onClose(); }}
                                            disabled={isLoading}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-status-critical/10 border border-status-critical/40 font-mono text-[10px] font-bold text-status-critical uppercase tracking-widest hover:bg-status-critical/20 transition-all disabled:opacity-50"
                                        >
                                            <XCircle size={12} />
                                            CANCEL
                                        </button>
                                    )}
                                </>
                            )}

                            {shipment.status === "D" && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-status-ok/10 border border-status-ok/30">
                                    <Truck size={12} className="text-status-ok" />
                                    <span className="font-mono text-[10px] font-bold text-status-ok uppercase tracking-widest">DELIVERED ✓</span>
                                </div>
                            )}

                            {shipment.status === "C" && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-status-critical/10 border border-status-critical/30">
                                    <XCircle size={12} className="text-status-critical" />
                                    <span className="font-mono text-[10px] font-bold text-status-critical uppercase tracking-widest">CANCELLED</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-5 py-2 bg-bg-secondary/50 border border-border-default font-mono text-[10px] font-bold text-txt-primary uppercase tracking-widest hover:border-accent hover:text-accent transition-all disabled:opacity-50"
                        >
                            CLOSE
                        </button>
                    </footer>
                </div>

                <aside className="w-full md:w-72 border-l border-border-subtle bg-[#212121] flex flex-col shrink-0">
                    <div className="px-4 py-3 border-b border-border-subtle bg-bg-secondary/50 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-widest">
                                RESOURCES
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3">
                        {resourcesLoading ? (
                            <div className="flex flex-col items-center justify-center py-8 gap-3">
                                <div className="h-6 w-6 border-2 border-accent/30 border-t-accent animate-spin" />
                                <p className="font-mono text-[11px] uppercase tracking-wide text-txt-secondary">Loading...</p>
                            </div>
                        ) : resources.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 border border-dashed border-border-default">
                                <p className="font-mono text-[11px] uppercase tracking-wide text-txt-disabled italic text-center">
                                    No resources in this request
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {resources.map((item) => (
                                    <div
                                        key={item.id}
                                        className="px-3 py-2.5 border border-border-subtle bg-bg-tertiary/60 hover:bg-bg-tertiary transition-colors"
                                    >
                                        <div className="font-mono text-[11px] text-txt-primary truncate mb-1">
                                            {getResourceName(item.resource_id)}
                                        </div>
                                        <div className="flex items-center justify-end">
                                            <span className="font-mono text-[11px] text-txt-disabled uppercase tracking-wider">QTY</span>
                                            <span className="px-2 py-0.5 font-mono text-[11px] font-bold text-accent">
                                                {item.amount}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="px-4 py-2 bg-bg-secondary/30 shrink-0">
                        <span className="font-mono text-[11px] text-accent uppercase tracking-widest">
                            {resources.length} ITEM{resources.length !== 1 ? "S" : ""}
                        </span>
                    </div>
                </aside>
            </div>
        </div>
    );
}
