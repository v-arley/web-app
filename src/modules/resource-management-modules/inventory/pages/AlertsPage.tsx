import { AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { useToast } from "../../../../shared/hooks/useToast";
import { AlertDetailModal } from "../components/AlertDetailModal";
import { AlertsTable } from "../components/AlertsTable";
import { useAlertMutation } from "../hooks/useAlertMutation";
import { useAlertsQuery } from "../hooks/useAlertsQuery";
import type { ResourceAlertFormValues } from "../schemas/resource-alert.schema";
import { resourceAlertService } from "../services/ResourceAlertService";

export function AlertsPage() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<"active" | "history">("active");
    const [selectedAlert, setSelectedAlert] = useState<ResourceAlertFormValues | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 50;

    const { query: activeQuery } = useAlertsQuery(campId, true, "N", { page, limit: pageSize });
    const { query: historyQuery } = useAlertsQuery(campId, activeTab === "history", "Y", { page, limit: pageSize });
    const alertMutation = useAlertMutation();

    const currentQuery = activeTab === "active" ? activeQuery : historyQuery;
    const currentAlerts = currentQuery.data?.items ?? [];
    const pagination = currentQuery.data?.pagination ?? { page, limit: pageSize, total: 0, totalPages: 1 };

    useEffect(() => {
        if (currentQuery.error) {
            toast({
                tone: "error",
                title: "Query error",
                message: currentQuery.error.message,
            });
        }
    }, [currentQuery.error, toast]);

    const handleSync = async () => {
        if (isSyncing || currentQuery.isLoading) return;
        setIsSyncing(true);
        try {
            const created = await resourceAlertService.syncAlerts(campId);
            await currentQuery.refetch();
            toast({
                tone: "success",
                title: "Sync complete",
                message: created > 0
                    ? `${created} new alert(s) generated from low stock.`
                    : "Stock is already in sync. No new alerts created.",
            });
        } catch (error) {
            toast({
                tone: "error",
                title: "Sync failed",
                message: error instanceof Error ? error.message : "Could not sync alerts.",
            });
        } finally {
            setIsSyncing(false);
        }
    };

    const handleResolve = async (alertId: number) => {
        try {
            await alertMutation.resolve.mutateAsync(alertId);
            toast({
                tone: "success",
                title: "Alert resolved",
                message: "The alert record has been updated.",
            });
        } catch (error) {
            toast({
                tone: "error",
                title: "Resolution failed",
                message: error instanceof Error ? error.message : "Could not resolve the alert.",
            });
        }
    };

    const handleRowDoubleClick = (alert: ResourceAlertFormValues) => {
        setSelectedAlert(alert);
    };

    const tabs: Array<{ key: "active" | "history"; label: string; icon: React.ReactNode; description: string }> = [
        { key: "active", label: "Critical / Low Stock", icon: <AlertTriangle size={16} />, description: "Immediate attention required" },
        { key: "history", label: "Resolved History", icon: <CheckCircle size={16} />, description: "Handled alerts archive" },
    ];

    const accentColor = activeTab === "active" ? "text-status-critical" : "text-status-ok";
    const accentBg = activeTab === "active" ? "bg-status-critical/10" : "bg-status-ok/10";
    const accentBorder = activeTab === "active" ? "border-status-critical/30" : "border-status-ok/30";
    const accentBar = activeTab === "active" ? "bg-status-critical" : "bg-status-ok";
    const statusLabel = activeTab === "active" ? "[CRITICAL]" : "[RESOLVED]";

    return (
        <>
        <article className="rmm-scope flex h-full min-h-0 flex-col bg-transparent overflow-hidden relative no-scrollbar border border-border-default">
            {/* Topbar */}
            <header className="rmm-module-header flex items-stretch bg-black/50 backdrop-blur-lg shrink-0 z-10">
                {/* Module identity */}
                <div className="rmm-module-brand flex items-center gap-3 shrink-0">
                    <div className={`rmm-module-accent w-0.75 self-stretch ${accentBar}`}></div>
                    <div className="rmm-module-copy py-2 px-3">
                        <div className="rmm-module-title text-xl font-abril font-bold uppercase tracking-widest text-txt-primary leading-none">
                            Stock Alerts
                        </div>
                        <p className="rmm-module-subtitle text-[9px] text-txt-muted uppercase tracking-wide mt-0.5">
                            Resource Management
                        </p>
                    </div>
                </div>

                {/* Horizontal tab nav */}
                <nav className="rmm-module-tabs flex items-stretch flex-1 justify-end">
                    {tabs.map((tab, ) => (
                        <button
                            key={tab.key}
                            onClick={() => {
                                setActiveTab(tab.key);
                                setPage(1);
                            }}
                            className={`rmm-module-tab relative flex items-center gap-2.5 px-5 border-r border-border-subtle transition-all group ${
                                activeTab === tab.key
                                    ? `rmm-module-tab--active bg-bg-app/60 ${accentColor}`
                                    : "text-txt-muted hover:bg-bg-secondary/40 hover:text-txt-primary"
                            }`}
                        >
                            {activeTab === tab.key && (
                                <div className={`rmm-module-tab-indicator absolute bottom-0 left-0 right-0 h-0.5 ${accentBar}`} />
                            )}
                            {/* <span className={`rmm-module-tab-index font-mono text-[9px] opacity-40 ${activeTab === tab.key ? `${accentColor} opacity-60` : ""}`}>
                                {String(i + 1).padStart(2, "0")}
                            </span> */}
                            <span className={`rmm-module-tab-icon ${activeTab === tab.key ? accentColor : "text-txt-disabled group-hover:text-txt-secondary"}`}>
                                {tab.icon}
                            </span>
                            <div className="rmm-module-tab-copy text-left">
                                <div className="rmm-module-tab-label font-mono text-[10px] font-bold uppercase tracking-widest">
                                    {tab.label}
                                </div>
                                {/* <div className="rmm-module-tab-description font-mono text-[8px] text-txt-disabled uppercase tracking-wide">
                                    {tab.description}
                                </div> */}
                            </div>
                        </button>
                    ))}
                </nav>

                {/* Sync button */}
                <div className="rmm-module-actions flex items-center px-4 border-l border-border-default shrink-0 gap-3">
                    <button
                        onClick={handleSync}
                        className={`rmm-module-action-btn flex items-center gap-2 px-3 py-1.5 ${accentBg} border ${accentBorder} ${accentColor} font-mono text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        disabled={isSyncing || currentQuery.isLoading}
                    >
                        <RefreshCw size={12} className={isSyncing || currentQuery.isLoading ? "animate-spin" : ""} />
                        SYNC
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden p-4 gap-3">
                <section className="flex flex-col bg-black/50 backdrop-blur-lg border border-border-default overflow-hidden shadow-sm flex-1 min-h-0">
                    {/* <header className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-bg-secondary/30 shrink-0">
                        <h3 className="text-[11px] font-mono font-bold text-txt-primary uppercase tracking-wide flex items-center gap-2">
                            <div className={`w-1 h-3 ${accentBar}`} />
                            {activeTab === "active" ? "Critical Asset Monitoring" : "Resolved Incidents Archive"}
                        </h3>
                        {pagination.total > 0 && (
                            <span className={`text-[11px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 ${accentColor} ${accentBg}`}>
                                COUNT: {String(pagination.total).padStart(4, "0")}
                            </span>
                        )}
                    </header> */}

                    <div className="flex-1 overflow-auto">
                        {currentQuery.isLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`h-5 w-5 border-2 ${activeTab === "active" ? "border-status-critical" : "border-status-ok"} border-t-transparent animate-spin`} />
                                    <span className="font-mono text-[10px] text-txt-muted uppercase tracking-[0.3em]">Querying Database...</span>
                                </div>
                            </div>
                        ) : currentAlerts.length > 0 ? (
                            <AlertsTable
                                alerts={currentAlerts}
                                onRowDoubleClick={handleRowDoubleClick}
                            />
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-center p-20 opacity-40 grayscale">
                                <CheckCircle size={48} className="text-txt-disabled mb-4" />
                                <div className="font-mono text-[12px] font-bold text-txt-primary uppercase tracking-widest mb-1">
                                    {activeTab === "active" ? "No active alerts" : "No resolved alerts"}
                                </div>
                                <div className="font-mono text-[10px] text-txt-disabled uppercase tracking-wider">
                                    System status within normal operating parameters.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pagination footer */}
                    <footer className="flex items-center justify-between px-4 py-1.5 border-t border-border-default bg-bg-secondary/30 shrink-0">
                        <div className="flex items-center gap-4 font-mono text-[11px] text-txt-muted uppercase tracking-widest">
                            <span>Total: <span className={`${accentColor} font-bold`}>{String(pagination.total).padStart(4, "0")}</span></span>
                            {/* <span className="opacity-30">|</span>
                            <span className={`${accentColor} font-bold`}>{statusLabel}</span> */}
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest">
                            <button
                                disabled={pagination.page <= 1}
                                onClick={() => setPage(Math.max(1, pagination.page - 1))}
                                className="px-2 py-1 border border-border-default text-txt-muted hover:border-accent hover:text-accent transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                            >◄ PREV</button>
                            <span className="px-3 py-1 border border-border-subtle text-txt-secondary tabular-nums">
                                {String(pagination.page).padStart(2, "0")}
                                <span className="text-txt-muted opacity-40 mx-1">/</span>
                                {String(pagination.totalPages).padStart(2, "0")}
                            </span>
                            <button
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => setPage(Math.min(pagination.totalPages, pagination.page + 1))}
                                className="px-2 py-1 border border-border-default text-txt-muted hover:border-accent hover:text-accent transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                            >NEXT ►</button>
                        </div>
                    </footer>
                </section>
            </main>
        </article>

        {/* Alert Detail Modal */}
        {selectedAlert && (
            <AlertDetailModal
                alert={selectedAlert}
                onClose={() => setSelectedAlert(null)}
                onResolve={activeTab === "active" ? handleResolve : undefined}
            />
        )}
        </>
    );
}
