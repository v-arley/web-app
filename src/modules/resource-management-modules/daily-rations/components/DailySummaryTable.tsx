import { useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    RefreshCw,
    Users,
    Play,
    PackageOpen,
} from "lucide-react";
import { useDailySummaryQuery, useCompletePendingRations } from "../hooks/useDailySummaryQuery";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { useToast } from "../../../../shared/hooks/useToast";
import PaginationFooter from "../../shared/components/PaginationFooter";
import type { DailySummaryPersonStatus } from "../services/RationDailySummaryService";

const STATUS_LABEL: Record<DailySummaryPersonStatus, string> = {
    delivered: "DELIVERED",
    pending: "PENDING",
};

const STATUS_BADGE: Record<DailySummaryPersonStatus, string> = {
    delivered: "app-table-badge--ok",
    pending: "app-table-badge--warn",
};

type StatusFilter = DailySummaryPersonStatus | "";

const PAGE_SIZE = 20;

interface ExecutionResult {
    completed_now: number;
    still_pending: number;
}

export function DailySummaryTable() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;
    const { toast } = useToast();

    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
    const [page, setPage] = useState(1);
    const [lastResult, setLastResult] = useState<ExecutionResult | null>(null);

    const { data: summary, isLoading, refetch, isFetching } = useDailySummaryQuery(campId, {
        date,
        page,
        limit: PAGE_SIZE,
        status: statusFilter,
    });

    const completePending = useCompletePendingRations(campId);

    const persons = summary?.persons ?? [];
    const pagination = summary?.pagination ?? { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 };
    const hasPending = (summary?.pending ?? 0) > 0;

    const handleStatusChange = (value: StatusFilter) => {
        setStatusFilter(value);
        setPage(1);
    };

    const handleDateChange = (value: string) => {
        setDate(value);
        setPage(1);
        setLastResult(null);
    };

    const handleCompletePending = async () => {
        setLastResult(null);
        try {
            const result = await completePending.mutateAsync(date);
            setLastResult(result);
            setPage(1);

            if (result.completed_now > 0) {
                toast({
                    tone: "success",
                    title: "Asignación completada",
                    message: `${result.completed_now} raciones entregadas.${result.still_pending > 0 ? ` ${result.still_pending} aún pendientes por stock insuficiente.` : ""}`,
                });
            } else {
                toast({
                    tone: "warning",
                    title: "Sin cambios",
                    message: "El stock disponible no es suficiente para asignar raciones pendientes.",
                });
            }
        } catch (error) {
            toast({
                tone: "error",
                title: "Error en la asignación",
                message: error instanceof Error ? error.message : "No se pudo ejecutar la asignación.",
            });
        }
    };

    return (
        <article className="app-content-body">
            <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

                {/* ── Header ── */}
                <header className="app-panel-header">
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="app-panel-title">Daily Ration Summary</div>
                        <p className="app-panel-subtitle">Population ration status for the selected date</p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <span className="app-eyebrow">Date</span>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="app-input"
                                style={{ fontSize: "12px" }}
                            />
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <span className="app-eyebrow">Status</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => handleStatusChange(e.target.value as StatusFilter)}
                                className="app-input"
                                style={{ fontSize: "12px" }}
                            >
                                <option value="">All</option>
                                <option value="delivered">Delivered</option>
                                <option value="pending">Pending</option>
                            </select>
                        </label>
                        <button
                            type="button"
                            onClick={() => void refetch()}
                            disabled={isFetching}
                            className="app-btn app-btn--ghost"
                            title="Refresh"
                        >
                            <RefreshCw size={13} className={isFetching ? "app-spin" : ""} />
                        </button>
                    </div>
                </header>

                {isLoading ? (
                    <div className="app-loading-state">Loading daily summary...</div>
                ) : summary ? (
                    <>
                        {/* ── KPIs ── */}
                        <div className="app-kpi-stripe">
                            <div className="app-kpi-card">
                                <div className="app-kpi-label">Population</div>
                                <div className="app-kpi-value">{summary.total_population}</div>
                            </div>
                            <div className="app-kpi-card" style={{ borderColor: "var(--color-status-ok)" }}>
                                <div className="app-kpi-label">Delivered</div>
                                <div className="app-kpi-value" style={{ color: "var(--color-status-ok)" }}>
                                    {summary.delivered}
                                </div>
                            </div>
                            <div className="app-kpi-card" style={{ borderColor: "var(--color-status-warning)" }}>
                                <div className="app-kpi-label">Pending</div>
                                <div className="app-kpi-value" style={{ color: "var(--color-status-warning)" }}>
                                    {summary.pending}
                                </div>
                            </div>
                            <div className="app-kpi-card">
                                <div className="app-kpi-label">Delivery Rate</div>
                                <div className="app-kpi-value">{summary.delivery_rate}</div>
                            </div>
                        </div>

                        {/* ── Admin action panel (always visible when there are pending rations) ── */}
                        {hasPending && (
                            <div
                                className="app-hud-frame"
                                style={{
                                    margin: "0 0.75rem",
                                    padding: "0.75rem 1rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.75rem",
                                    borderColor: "var(--color-status-warning)",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <AlertTriangle size={14} style={{ color: "var(--color-status-warning)", flexShrink: 0 }} />
                                    <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em" }}>
                                        RACIONES PENDIENTES — {date}
                                    </span>
                                </div>

                                <p style={{ margin: 0, fontSize: "12px", opacity: 0.8, lineHeight: 1.5 }}>
                                    <strong>{summary.pending}</strong> persona(s) tienen ración pendiente por stock agotado.
                                    Reponga el inventario y ejecute la asignación para entregar las raciones restantes.
                                    El proceso se detendrá nuevamente si el stock se agota.
                                </p>

                                {/* Resources consumed so far */}
                                {summary.resources_consumed.length > 0 && (
                                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
                                        <span className="app-eyebrow" style={{ flexShrink: 0 }}>Stock consumido:</span>
                                        {summary.resources_consumed.map((r) => (
                                            <span key={r.resource_id} className="app-table-badge app-table-badge--neutral">
                                                {r.resource_name}: {r.total_consumed} {r.unit_of_measure}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                                    <button
                                        type="button"
                                        onClick={() => void handleCompletePending()}
                                        disabled={completePending.isPending}
                                        className="app-btn app-btn--primary"
                                    >
                                        <Play size={12} fill="currentColor" />
                                        {completePending.isPending
                                            ? "Ejecutando asignación..."
                                            : "Ejecutar asignación pendiente"}
                                    </button>

                                    {/* Inline result after execution */}
                                    {lastResult !== null && (
                                        lastResult.completed_now > 0 ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "12px" }}>
                                                <CheckCircle2 size={13} style={{ color: "var(--color-status-ok)", flexShrink: 0 }} />
                                                <span>
                                                    <strong style={{ color: "var(--color-status-ok)" }}>{lastResult.completed_now}</strong> entregadas
                                                    {lastResult.still_pending > 0 && (
                                                        <> — <strong style={{ color: "var(--color-status-warning)" }}>{lastResult.still_pending}</strong> aún pendientes</>
                                                    )}
                                                </span>
                                            </div>
                                        ) : (
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "12px" }}>
                                                <PackageOpen size={13} style={{ color: "var(--color-status-warning)", flexShrink: 0 }} />
                                                <span style={{ opacity: 0.8 }}>Stock insuficiente — sin cambios</span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Resources consumed when all delivered */}
                        {!hasPending && summary.resources_consumed.length > 0 && (
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", padding: "0 0.75rem", alignItems: "center" }}>
                                <span className="app-eyebrow" style={{ flexShrink: 0 }}>Consumed:</span>
                                {summary.resources_consumed.map((r) => (
                                    <span key={r.resource_id} className="app-table-badge app-table-badge--neutral">
                                        {r.resource_name}: {r.total_consumed} {r.unit_of_measure}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* ── Table ── */}
                        <div className="app-table-region app-table-frame">
                            {persons.length === 0 ? (
                                <div className="app-empty-state">
                                    <Users size={20} style={{ opacity: 0.3 }} />
                                    <span className="app-eyebrow" style={{ textAlign: "center" }}>
                                        {summary.total_population === 0
                                            ? "No active population found for this date"
                                            : "No results for the selected filter"}
                                    </span>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop table */}
                                    <div className="app-table-wrap hidden md:block">
                                        <table className="app-table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>DNI</th>
                                                    <th>Status</th>
                                                    <th>Assigned at</th>
                                                    <th>Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody className="app-stagger-rows">
                                                {persons.map((person) => (
                                                    <tr key={person.person_id} className="app-table-row">
                                                        <td className="app-table-cell--primary">{person.name}</td>
                                                        <td className="app-table-cell--number">{person.dni}</td>
                                                        <td>
                                                            <span className={`app-table-badge ${STATUS_BADGE[person.status]}`}>
                                                                {person.status === "delivered"    && <CheckCircle2 size={10} />}
                                                                {person.status === "pending"      && <Clock size={10} />}
                                                                {STATUS_LABEL[person.status]}
                                                            </span>
                                                        </td>
                                                        <td className="app-table-cell--time">
                                                            {person.ration_created_at
                                                                ? new Date(person.ration_created_at).toLocaleTimeString([], {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })
                                                                : <span style={{ opacity: 0.35 }}>—</span>}
                                                        </td>
                                                        <td>
                                                            {person.notes
                                                                ? <span style={{ fontSize: "11px", opacity: 0.75 }}>{person.notes}</span>
                                                                : <span style={{ opacity: 0.35 }}>—</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile cards */}
                                    <div className="grid gap-3 md:hidden">
                                        {persons.map((person) => (
                                            <div
                                                key={person.person_id}
                                                className={`border-l-2 p-3 border border-border-default ${
                                                    person.status === "delivered"
                                                        ? "border-l-status-success bg-status-success/5"
                                                        : "border-l-status-warning bg-status-warning/5"
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="font-mono text-[10px] text-txt-disabled uppercase tracking-widest">
                                                            {person.dni}
                                                        </div>
                                                        <div className="mt-1 font-mono text-xs font-bold uppercase text-txt-primary">
                                                            {person.name}
                                                        </div>
                                                    </div>
                                                    <span className={`app-table-badge shrink-0 ${STATUS_BADGE[person.status]}`}>
                                                        {STATUS_LABEL[person.status]}
                                                    </span>
                                                </div>
                                                {(person.ration_created_at || person.notes) && (
                                                    <div className="mt-3 grid gap-2 font-mono text-[11px] text-txt-secondary">
                                                        {person.ration_created_at && (
                                                            <div className="flex justify-between gap-3">
                                                                <span className="text-txt-disabled uppercase">Assigned at</span>
                                                                <span>
                                                                    {new Date(person.ration_created_at).toLocaleTimeString([], {
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    })}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {person.notes && (
                                                            <div className="border-t border-border-default pt-2">
                                                                <span className="block text-txt-disabled uppercase">Notes</span>
                                                                <span className="mt-1 block text-txt-secondary">{person.notes}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ── Pagination footer ── */}
                        <PaginationFooter
                            page={pagination.page}
                            setPage={setPage}
                            totalPages={pagination.totalPages}
                            totalRecords={pagination.total}
                        />
                    </>
                ) : (
                    <div className="app-empty-state">
                        <Users size={20} style={{ opacity: 0.3 }} />
                        <span className="app-eyebrow" style={{ textAlign: "center" }}>
                            No data available for the selected date
                        </span>
                    </div>
                )}
            </div>
        </article>
    );
}
