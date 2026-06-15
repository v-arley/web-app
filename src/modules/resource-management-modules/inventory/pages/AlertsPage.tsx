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
            toast({ tone: "error", title: "Query error", message: currentQuery.error.message });
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
            toast({ tone: "success", title: "Alert resolved", message: "The alert record has been updated." });
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

    return (
        <>
            <article className="app-scope app-module">
                <header className="app-module-header">
                    <div className="app-module-brand">
                        <div className="app-module-copy">
                            <div className="app-module-title">Stock Alerts</div>
                            <p className="app-module-subtitle">Resource Management</p>
                        </div>
                    </div>

                    <nav className="app-module-tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => { setActiveTab(tab.key); setPage(1); }}
                                className={`app-module-tab ${activeTab === tab.key ? "app-module-tab--active" : ""}`}
                            >
                                {activeTab === tab.key && <div className="app-module-tab-indicator" />}
                                <span className="app-module-tab-icon">{tab.icon}</span>
                                <div className="app-module-tab-copy">
                                    <div className="app-module-tab-label">{tab.label}</div>
                                </div>
                            </button>
                        ))}
                    </nav>

                    <div className="app-module-actions">
                        <button
                            onClick={handleSync}
                            className="app-btn app-btn--primary app-btn--sm"
                            disabled={isSyncing || currentQuery.isLoading}
                        >
                            <RefreshCw size={12} className={isSyncing || currentQuery.isLoading ? "animate-spin" : ""} />
                            SYNC
                        </button>
                    </div>
                </header>

                <main className="app-module-body" style={{ padding: "1rem", gap: "0.75rem" }}>
                    <section className="app-split app-split--glass" style={{ flexDirection: "column" }}>
                        <div className="app-table-region">
                            {currentQuery.isLoading ? (
                                <div className="app-loading-state" style={{ flexDirection: "column", gap: "0.5rem" }}>
                                    <div className="app-spinner" />
                                    <span className="app-eyebrow" style={{ letterSpacing: "0.3em" }}>Querying Database...</span>
                                </div>
                            ) : currentAlerts.length > 0 ? (
                                <AlertsTable
                                    alerts={currentAlerts}
                                    onRowDoubleClick={handleRowDoubleClick}
                                />
                            ) : (
                                <div className="app-empty-state">
                                    <CheckCircle size={48} />
                                    <div className="app-panel-title">
                                        {activeTab === "active" ? "No active alerts" : "No resolved alerts"}
                                    </div>
                                    <div className="app-muted">
                                        System status within normal operating parameters.
                                    </div>
                                </div>
                            )}
                        </div>

                        <footer className="app-table-footer">
                            <div className="app-table-footer-meta">
                                <span>Total: <span className="app-eyebrow" style={{ color: activeTab === "active" ? "var(--color-status-critical)" : "var(--color-status-ok)" }}>{String(pagination.total).padStart(4, "0")}</span></span>
                            </div>
                            <div className="app-table-footer-controls">
                                <button
                                    disabled={pagination.page <= 1}
                                    onClick={() => setPage(Math.max(1, pagination.page - 1))}
                                    className="app-btn app-btn--outline app-btn--sm"
                                >◄ PREV</button>
                                <span className="app-page-counter">
                                    {String(pagination.page).padStart(2, "0")}
                                    <span style={{ opacity: 0.4, margin: "0 0.25rem" }}>/</span>
                                    {String(pagination.totalPages).padStart(2, "0")}
                                </span>
                                <button
                                    disabled={pagination.page >= pagination.totalPages}
                                    onClick={() => setPage(Math.min(pagination.totalPages, pagination.page + 1))}
                                    className="app-btn app-btn--outline app-btn--sm"
                                >NEXT ►</button>
                            </div>
                        </footer>
                    </section>
                </main>
            </article>

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
