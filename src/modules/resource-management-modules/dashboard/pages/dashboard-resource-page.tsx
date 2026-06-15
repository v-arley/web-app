import { useState } from "react";
import { Users, AlertTriangle, Utensils, Truck, RefreshCw, BarChart3 } from "lucide-react";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { useDashboard } from "../hooks/useDashboard";
import { MetricCard } from "../components/MetricCard";
import { StockTable } from "../components/StockTable";
import { ActivityTable } from "../components/ActivityTable";

type DashboardTab = "overview" | "analytics" | "notifications";

export function DashboardResourcePage() {
    const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

    const {
        metrics,
        stockSummary,
        recentActivity,
        isLoadingMetrics,
        isLoadingStock,
        isLoadingActivity,
        error,
        refresh,
    } = useDashboard(campId, true);

    const activityItems = recentActivity.map((log) => ({
        id: log.id,
        action: log.action,
        detail: `${log.table_name} #${log.record_id || "N/A"}`,
        username: log.username || "Sistema",
        created_at: log.created_at,
    }));

    const tabs: Array<{ key: DashboardTab; label: string; icon: React.ReactNode; description: string }> = [
        { key: "overview", label: "Overview Metrics", icon: <BarChart3 size={16} />, description: "Operational data summary" },
    ];

    return (
        <article className="app-scope app-module">
            <header className="app-module-header">
                <div className="app-module-brand">
                    <div className="app-module-copy">
                        <div className="app-module-title">Dashboard</div>
                        <p className="app-module-subtitle">Resource Management</p>
                    </div>
                </div>

                <nav className="app-module-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
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
                        onClick={refresh}
                        className="app-btn app-btn--primary app-btn--sm"
                        disabled={isLoadingMetrics || isLoadingStock || isLoadingActivity}
                    >
                        <RefreshCw size={12} className={isLoadingMetrics ? "animate-spin" : ""} />
                        SYNC
                    </button>
                </div>
            </header>

            <main className="app-module-body app-module-body--scroll">
                <div className="app-content-pad" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {error && (
                        <div className="app-alert app-alert--error">
                            <AlertTriangle size={14} />
                            SYSTEM_ERROR: {error}
                        </div>
                    )}

                    {activeTab === "overview" && (
                        <>
                            <section>
                                <div className="app-metric-grid app-stagger">
                                    <MetricCard
                                        title="Population"
                                        value={metrics?.population.current || 0}
                                        subtitle={`Total Capacity: ${metrics?.population.total || 0}`}
                                        icon={<Users size={24} />}
                                        variant="default"
                                        showProgressBar
                                        progressPercentage={metrics?.population.percentage || 0}
                                    />
                                    <MetricCard
                                        title="Critical Alerts"
                                        value={metrics?.critical_alerts || 0}
                                        subtitle="Stock below minimum"
                                        icon={<AlertTriangle size={24} />}
                                        variant={
                                            (metrics?.critical_alerts || 0) > 0
                                                ? (metrics?.critical_alerts || 0) > 5
                                                    ? "critical"
                                                    : "warning"
                                                : "success"
                                        }
                                    />
                                    <MetricCard
                                        title="Daily Rations"
                                        value={`${metrics?.rations_today.delivered || 0}/${metrics?.rations_today.total || 0}`}
                                        subtitle={`${(metrics?.rations_today.percentage || 0).toFixed(1)}% Completed`}
                                        icon={<Utensils size={24} />}
                                        variant="default"
                                        showProgressBar
                                        progressPercentage={metrics?.rations_today.percentage || 0}
                                    />
                                    <MetricCard
                                        title="Shipments"
                                        value={metrics?.shipments_in_transit || 0}
                                        subtitle="In Transit (Inter-Camp)"
                                        icon={<Truck size={24} />}
                                        variant="default"
                                    />
                                </div>
                            </section>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))", gap: "0.75rem" }}>
                                <section className="app-panel app-table-frame" style={{ height: "100%" }}>
                                    <header className="app-panel-header">
                                        <h2 className="app-panel-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <div style={{ width: "0.25rem", height: "0.75rem", background: "var(--color-accent)" }} />
                                            Internal Stock Status
                                        </h2>
                                        <span className="app-muted" style={{ fontSize: "9px", letterSpacing: "0.1em" }}>
                                            [Top 10 High Priority Items]
                                        </span>
                                    </header>
                                    <div className="app-table-wrap">
                                        <StockTable items={stockSummary} isLoading={isLoadingStock} />
                                    </div>
                                </section>

                                {/* <section className="app-panel app-table-frame">
                                    <header className="app-panel-header">
                                        <h2 className="app-panel-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <div style={{ width: "0.25rem", height: "0.75rem", background: "var(--color-txt-primary)" }} />
                                            Operational Log
                                        </h2>
                                        <span className="app-muted" style={{ fontSize: "9px", letterSpacing: "0.1em" }}>
                                            [Recent System Actions]
                                        </span>
                                    </header>
                                    <div className="app-table-wrap">
                                        <ActivityTable items={activityItems} isLoading={isLoadingActivity} />
                                    </div>
                                </section> */}
                            </div>

                            {!isLoadingMetrics && metrics && metrics.population.current === 0 && (
                                <div className="app-alert app-alert--warn" style={{ textAlign: "center" }}>
                                    SYSTEM_STATUS: [PENDING_BACKEND_IMPLEMENTATION]
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </article>
    );
}
