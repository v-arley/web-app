import { Users, AlertTriangle, Utensils, Truck, RefreshCw, BarChart3, ListFilter, Bell } from "lucide-react";
import { getAuthContextFromToken } from "../../../../utils/authAccess";
import { useDashboard } from "../hooks/useDashboard";
import { MetricCard } from "../components/MetricCard";
import { StockTable } from "../components/StockTable";
import { ActivityTable } from "../components/ActivityTable";

export function DashboardResourcePage() {
    const authContext = getAuthContextFromToken();
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

    return (
        <div className="rmm-scope flex h-full">
            {/* Nav Sidebar Section */}
            <aside className="w-64 shrink-0 flex flex-col bg-bg-primary border-r border-border-default h-full">
                <header className="px-4 py-3 border-b border-border-default">
                    <div className="rmm-section-header mb-0">
                        <span className="rmm-section-title">CONTROL PANEL</span>
                        <span className="rmm-section-id">DASHBOARD</span>
                    </div>
                </header>

                <nav className="flex-1 p-3 space-y-1">
                    <div className="text-[9px] font-mono text-txt-muted px-3 py-2 uppercase tracking-widest opacity-50">
                        System Views
                    </div>
                    <button className="w-full flex items-center gap-3 px-3 py-2 bg-accent/10 border-l-2 border-accent text-accent font-mono text-[11px] uppercase tracking-wider text-left">
                        <BarChart3 size={14} />
                        Overview Metrics
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-txt-secondary hover:bg-bg-secondary font-mono text-[11px] uppercase tracking-wider text-left transition-colors grayscale hover:grayscale-0">
                        <ListFilter size={14} />
                        Filter Analytics
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-txt-secondary hover:bg-bg-secondary font-mono text-[11px] uppercase tracking-wider text-left transition-colors grayscale hover:grayscale-0">
                        <Bell size={14} />
                        Notification Log
                    </button>
                </nav>

                <footer className="p-4 border-t border-border-default bg-bg-secondary/50">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[10px] font-mono text-txt-muted uppercase">
                            <span>Last Update</span>
                            <span>{new Date().toLocaleTimeString()}</span>
                        </div>
                        <button
                            onClick={refresh}
                            className="rmm-btn rmm-btn-primary w-full justify-center text-[10px]"
                            disabled={isLoadingMetrics || isLoadingStock || isLoadingActivity}
                        >
                            <RefreshCw size={12} className={isLoadingMetrics ? "animate-spin" : ""} />
                            Sync Data
                        </button>
                    </div>
                </footer>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-bg-app overflow-y-auto relative">
                {/* Corner Brackets */}
                <div className="rmm-bracket rmm-bracket-tl opacity-20" />
                <div className="rmm-bracket rmm-bracket-tr opacity-20" />
                <div className="rmm-bracket rmm-bracket-bl opacity-20" />
                <div className="rmm-bracket rmm-bracket-br opacity-20" />

                <header className="flex items-center justify-between px-4 py-2 border-b border-border-default bg-bg-tertiary">
                    <div>
                        <h3 className="text-sm font-bold text-txt-primary uppercase tracking-tight">
                            Resource Management Dashboard
                        </h3>
                        <p className="text-[10px] font-mono text-txt-muted uppercase tracking-widest mt-1">
                            Operational Node: <span className="text-accent">CAMP-ID {String(campId).padStart(3, '0')}</span>
                        </p>
                    </div>
                </header>

                <div className="p-4 space-y-3">
                    {error && (
                        <div className="px-4 py-3 border border-status-critical/30 bg-status-critical/5 text-status-critical font-mono text-[11px] uppercase tracking-widest flex items-center gap-3">
                            <AlertTriangle size={14} />
                            SYSTEM_ERROR: {error}
                        </div>
                    )}

                    {/* Metrics Grid */}
                    <section>
                        <div className="rmm-section-header">
                            <span className="rmm-section-title">Operational Data</span>
                            <span className="rmm-section-id">SEC_01</span>
                            <div className="rmm-section-line" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                        {/* Stock Summary Section */}
                        <section className="flex flex-col bg-bg-tertiary border border-border-default overflow-hidden shadow-sm">
                            <header className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-bg-secondary/30">
                                <h2 className="text-[11px] font-mono font-bold text-txt-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1 h-3 bg-accent" />
                                    Internal Stock Status
                                </h2>
                                <span className="text-[9px] font-mono text-txt-muted uppercase tracking-tighter">
                                    [Top 10 High Priority Items]
                                </span>
                            </header>
                            <div className="overflow-x-auto">
                                <StockTable items={stockSummary} isLoading={isLoadingStock} />
                            </div>  
                        </section>

                        {/* Activity Log Section */}
                        <section className="flex flex-col bg-bg-tertiary border border-border-default overflow-hidden shadow-sm">
                            <header className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-bg-secondary/30">
                                <h2 className="text-[11px] font-mono font-bold text-txt-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1 h-3 bg-txt-primary" />
                                    Operational Log
                                </h2>
                                <span className="text-[9px] font-mono text-txt-muted uppercase tracking-tighter">
                                    [Recent System Actions]
                                </span>
                            </header>
                            <div className="overflow-x-auto">
                                <ActivityTable items={activityItems} isLoading={isLoadingActivity} />
                            </div>
                        </section>
                    </div>

                    {!isLoadingMetrics && metrics && metrics.population.current === 0 && (
                        <div className="px-4 py-3 border border-status-warning/30 bg-status-warning/5 text-status-warning font-mono text-[10px] uppercase tracking-[0.2em] text-center">
                            SYSTEM_STATUS: [PENDING_BACKEND_IMPLEMENTATION] // ENDPOINT: /dashboard-metrics
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
