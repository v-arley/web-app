import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, RefreshCw, Info } from "lucide-react";
import { useState } from "react";
import { getAuthContextFromToken } from "../../../../utils/authAccess";
import { AlertsTable } from "../components/AlertsTable";
import { useAlertMutation } from "../hooks/useAlertMutation";
import { useAlertsQuery } from "../hooks/useAlertsQuery";

function AlertBanner({ tone, message }: { tone: "error" | "success" | "info"; message: string }) {
    const toneClassName =
        tone === "error"
            ? "bg-status-critical/10 border-status-critical/30 text-status-critical"
            : tone === "success"
            ? "bg-status-ok/10 border-status-ok/30 text-status-ok"
            : "bg-status-info/10 border-status-info/30 text-status-info";

    return (
        <div className={`px-4 py-3 border font-mono text-[11px] uppercase tracking-widest flex items-center gap-3 ${toneClassName}`}>
            {tone === "error" ? <AlertTriangle size={14} /> : tone === "success" ? <CheckCircle size={14} /> : <Info size={14} />}
            {message}
        </div>
    );
}

function AlertsPageContent() {
    const authContext = getAuthContextFromToken();
    const campId = authContext.campId ?? 0;

    const [feedback, setFeedback] = useState<{ tone: "error" | "success" | "info"; message: string } | null>(null);

    const { query } = useAlertsQuery(campId, true);
    const alertMutation = useAlertMutation();

    const handleResolve = async (alertId: number) => {
        try {
            await alertMutation.resolve.mutateAsync(alertId);
            setFeedback({ tone: "success", message: "ALERTA_RESUELTA: Registro actualizado correctamente." });
        } catch (error) {
            setFeedback({
                tone: "error",
                message: error instanceof Error ? `ERROR_SISTEMA: ${error.message}` : "CRITICAL_FAILURE: No se pudo resolver la alerta.",
            });
        }
    };

    const handleViewDetail = (warehouseId: number, resourceId: number) => {
        console.log("Ver detalle:", { warehouseId, resourceId });
    };

    return (
        <div className="rmm-scope flex h-full">
            {/* Nav Sidebar */}
            <aside className="w-64 shrink-0 flex flex-col bg-bg-primary border-r border-border-default h-full">
                <header className="p-6 border-b border-border-default">
                    <div className="rmm-section-header mb-0">
                        <span className="rmm-section-title">INVENTORY</span>
                        <span className="rmm-section-id">ALERTS</span>
                    </div>
                </header>

                <nav className="flex-1 p-3 space-y-1">
                    <div className="text-[9px] font-mono text-txt-muted px-3 py-2 uppercase tracking-widest opacity-50">
                        Monitoring Filters
                    </div>
                    <button className="w-full flex items-center gap-3 px-3 py-2 bg-accent/10 border-l-2 border-accent text-accent font-mono text-[11px] uppercase tracking-wider text-left">
                        <AlertTriangle size={14} />
                        Critical/Low Stock
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-txt-secondary hover:bg-bg-secondary font-mono text-[11px] uppercase tracking-wider text-left transition-colors grayscale hover:grayscale-0">
                        <CheckCircle size={14} />
                        Resolved History
                    </button>
                </nav>

                <footer className="p-4 border-t border-border-default bg-bg-secondary/50">
                    <button
                        onClick={() => query.refetch()}
                        className="rmm-btn rmm-btn-primary w-full justify-center text-[10px]"
                        disabled={query.isLoading}
                    >
                        <RefreshCw size={12} className={query.isLoading ? "animate-spin" : ""} />
                        Re-Scan Stock
                    </button>
                </footer>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-bg-app overflow-hidden relative">
                <div className="rmm-bracket rmm-bracket-tl opacity-20" />
                <div className="rmm-bracket rmm-bracket-tr opacity-20" />
                
                <header className="flex items-center justify-between px-8 py-4 border-b border-border-default bg-bg-tertiary">
                    <div>
                        <h3 className="text-xl font-bold text-txt-primary uppercase tracking-widest">
                            Stock Alerts & Notifications
                        </h3>
                        <p className="text-[10px] font-mono text-txt-muted uppercase tracking-widest mt-1">
                            Status: <span className={query.data && query.data.length > 0 ? "text-status-critical font-bold" : "text-status-ok"}>
                                {query.data && query.data.length > 0 ? `[${query.data.length} ACTIVE_ALERTS]` : "[SYSTEM_IDLE]"}
                            </span>
                        </p>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden flex flex-col p-8 space-y-4">
                    {feedback && <AlertBanner tone={feedback.tone} message={feedback.message} />}
                    {query.error && <AlertBanner tone="error" message={query.error.message} />}

                    <section className="flex-1 flex flex-col overflow-hidden bg-bg-tertiary border border-border-default">
                        <header className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-status-critical/5">
                            <h3 className="text-[14px] font-bold text-txt-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="font-mono tracking-widest w-1 h-3 bg-status-critical" />
                                Critical Asset Monitoring
                            </h3>
                            {query.data && query.data.length > 0 && (
                                <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-widest bg-accent-muted px-2 py-0.5">
                                    COUNT: {String(query.data.length).padStart(4, "0")}
                                </span>
                            )}
                        </header>

                        <div className="flex-1 overflow-auto">
                            {query.isLoading ? (
                                <div className="flex h-full items-center justify-center bg-bg-secondary/20">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-5 w-5 border-2 border-accent border-t-transparent animate-spin" />
                                        <span className="font-mono text-[10px] text-txt-muted uppercase tracking-[0.3em]">Querying Database...</span>
                                    </div>
                                </div>
                            ) : (
                                <AlertsTable
                                    alerts={query.data ?? []}
                                    onResolve={handleResolve}
                                    onViewDetail={handleViewDetail}
                                />
                            )}
                        </div>
                    </section>

                    <footer className="px-5 py-4 bg-status-info/5 border-l-4 border-status-info font-mono text-[10px] text-txt-secondary leading-relaxed">
                        <div className="flex items-start gap-3">
                            <Info size={16} className="text-status-info shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-status-info uppercase tracking-widest block mb-1">OPERATIONAL_GUIDE</span>
                                System triggers alerts when resource quantity ≤ configured minimum. Resolved alerts are archived 
                                for audit log tracking. Re-stocking will automatically clear visual indicators after manual resolution.
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export function AlertsPage() {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AlertsPageContent />
        </QueryClientProvider>
    );
}
