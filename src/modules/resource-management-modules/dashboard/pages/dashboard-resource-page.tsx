import { useState } from "react";
import { Users, AlertTriangle, Utensils, Truck, RefreshCw, BarChart3, ListFilter, Bell } from "lucide-react";
import { getAuthContextFromToken } from "../../../../shared/utils/authAccess";
import { useDashboard } from "../hooks/useDashboard";
import { MetricCard } from "../components/MetricCard";
import { StockTable } from "../components/StockTable";
import { ActivityTable } from "../components/ActivityTable";

type DashboardTab = "overview" | "analytics" | "notifications";

export function DashboardResourcePage() {
    const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
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

    const tabs: Array<{ key: DashboardTab; label: string; icon: React.ReactNode; description: string }> = [
        { key: "overview", label: "Overview Metrics", icon: <BarChart3 size={16} />, description: "Operational data summary" },
        { key: "analytics", label: "Filter Analytics", icon: <ListFilter size={16} />, description: "Advanced analytics view" },
        { key: "notifications", label: "Notification Log", icon: <Bell size={16} />, description: "System events log" },
    ];

    return (
            <article className="rmm-scope flex h-full min-h-0 flex-col bg-bg-app overflow-hidden relative">
            {/* Corner Brackets */}
            <div className="rmm-bracket rmm-bracket-tl"></div>
            <div className="rmm-bracket rmm-bracket-tr"></div>
            <div className="rmm-bracket rmm-bracket-bl"></div>
            <div className="rmm-bracket rmm-bracket-br"></div>

            {/* Topbar — identity + horizontal nav + refresh */}
            <header className="flex items-stretch border-b border-border-default bg-bg-tertiary shrink-0 z-10">

                {/* Module identity */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-0.75 self-stretch bg-accent"></div>
                    <div className="py-2 px-3">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-txt-primary leading-none">
                            Dashboard
                        </h3>
                        <p className="font-mono text-[9px] text-txt-muted uppercase tracking-wide mt-0.5">
                            Resource Management <span className="text-accent"> | </span> RMM-DASH
                        </p>
                    </div>
                </div>

                {/* Horizontal tab nav */}
                <nav className="flex items-stretch flex-1 justify-start">
                    {tabs.map((tab, i) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative flex items-center gap-2.5 px-5 border-r border-border-subtle transition-all group ${
                                activeTab === tab.key
                                    ? "bg-bg-app/60 text-accent"
                                    : "text-txt-muted hover:bg-bg-secondary/40 hover:text-txt-primary"
                            }`}
                        >
                            {/* Active bottom indicator */}
                            {activeTab === tab.key && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                            )}
                            {/* Tab number badge */}
                            <span className={`font-mono text-[9px] opacity-40 ${activeTab === tab.key ? "text-accent opacity-60" : ""}`}>
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            {/* Icon */}
                            <span className={activeTab === tab.key ? "text-accent" : "text-txt-disabled group-hover:text-txt-secondary"}>
                                {tab.icon}
                            </span>
                            {/* Label + desc */}
                            <div className="text-left">
                                <div className="font-mono text-[10px] font-bold uppercase tracking-widest">
                                    {tab.label}
                                </div>
                                <div className="font-mono text-[8px] text-txt-disabled uppercase tracking-wide">
                                    {tab.description}
                                </div>
                            </div>
                        </button>
                    ))}
                </nav>

                {/* Sync button */}
                <div className="flex items-center px-4 border-l border-border-default shrink-0 gap-3">
                    <button
                        onClick={refresh}
                        className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent text-accent font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoadingMetrics || isLoadingStock || isLoadingActivity}
                    >
                        <RefreshCw size={12} className={isLoadingMetrics ? "animate-spin" : ""} />
                        SYNC
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-bg-app overflow-y-auto relative">

                <div className="p-4 space-y-3">
                    {error && (
                        <div className="px-4 py-3 border border-status-critical/30 bg-status-critical/5 text-status-critical font-mono text-[11px] uppercase tracking-wide flex items-center gap-3">
                            <AlertTriangle size={14} />
                            SYSTEM_ERROR: {error}
                        </div>
                    )}

                    {/* OVERVIEW TAB */}
                    {activeTab === "overview" && (
                        <>
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
                                        <h2 className="text-[11px] font-mono font-bold text-txt-primary uppercase tracking-wide flex items-center gap-2">
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
                                        <h2 className="text-[11px] font-mono font-bold text-txt-primary uppercase tracking-wide flex items-center gap-2">
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
                                <div className="px-4 py-3 border border-status-warning/30 bg-status-warning/5 text-status-warning font-mono text-[10px] uppercase tracking-wide text-center">
                                    SYSTEM_STATUS: [PENDING_BACKEND_IMPLEMENTATION]
                                </div>
                            )}
                        </>
                    )}

                    {/* ANALYTICS TAB */}
                    {activeTab === "analytics" && (
                        <section className="flex items-center justify-center py-20 text-center">
                            <div className="space-y-4">
                                <ListFilter className="w-16 h-16 text-txt-muted/30 mx-auto" />
                                <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide">
                                    Filter Analytics
                                </div>
                                <div className="font-mono text-[9px] text-txt-muted uppercase tracking-wider max-w-xs">
                                    Advanced analytics and filtering tools will be available here
                                </div>
                            </div>
                        </section>
                    )}

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === "notifications" && (
                        <section className="flex items-center justify-center py-20 text-center">
                            <div className="space-y-4">
                                <Bell className="w-16 h-16 text-txt-muted/30 mx-auto" />
                                <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide">
                                    Notification Log
                                </div>
                                <div className="font-mono text-[9px] text-txt-muted uppercase tracking-wider max-w-xs">
                                    System event notifications and alerts will appear here
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </article>
    );
}
