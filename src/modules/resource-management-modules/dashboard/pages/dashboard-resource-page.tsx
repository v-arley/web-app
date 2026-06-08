import { useState } from "react";
import { Users, AlertTriangle, Utensils, Truck, RefreshCw, BarChart3, ListFilter, Bell } from "lucide-react";
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
        <article className="rmm-scope flex h-full min-h-0 flex-col bg-transparent overflow-hidden relative no-scrollbar border border-border-default">
            <header className="rmm-module-header flex items-stretch bg-black/50 backdrop-blur-lg shrink-0 z-10">
                <div className="rmm-module-brand flex items-center gap-3 shrink-0">
                    {/* <div className="rmm-module-accent w-0.75 self-stretch bg-accent"></div> */}
                    <div className="rmm-module-copy py-2 px-3">
                        <div className="rmm-module-title text-xl font-abril font-bold uppercase tracking-widest text-txt-primary leading-none">
                            Dashboard
                        </div>
                        <p className="rmm-module-subtitle text-[9px] text-txt-muted uppercase tracking-wide mt-0.5">
                            Resource Management
                        </p>
                    </div>
                </div>

                <nav className="rmm-module-tabs flex items-stretch flex-1 justify-end">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`rmm-module-tab relative flex items-center gap-2.5 px-5 border-r border-border-subtle transition-all group ${
                                activeTab === tab.key
                                    ? "rmm-module-tab--active bg-bg-app/60 text-[#CC361E]"
                                    : "text-txt-muted hover:bg-bg-secondary/40 hover:text-txt-primary"
                            }`}
                        >
                            {activeTab === tab.key && (
                                <div className="rmm-module-tab-indicator absolute bottom-0 left-0 right-0 h-0.5 bg-[#CC361E]" />
                            )}
                            {/* <span className={`rmm-module-tab-index font-mono text-[9px] opacity-40 ${activeTab === tab.key ? "text-[#CC361E] opacity-60" : ""}`}>
                                {String(i + 1).padStart(2, "0")}
                            </span> */}
                            <span className={`rmm-module-tab-icon ${activeTab === tab.key ? "text-[#CC361E]" : "text-txt-disabled group-hover:text-txt-secondary"}`}>
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

                <div className="rmm-module-actions flex items-center px-4 border-l border-border-default shrink-0 gap-3">
                    <button
                        onClick={refresh}
                        className="rmm-module-action-btn flex items-center gap-2 px-3 py-1.5 bg-[#CC361E]/10 border border-[#CC361E] text-[#CC361E] font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-[#CC361E]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoadingMetrics || isLoadingStock || isLoadingActivity}
                    >
                        <RefreshCw size={12} className={isLoadingMetrics ? "animate-spin" : ""} />
                        SYNC
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-y-auto relative">
                <div className="rmm-content-pad space-y-3">
                    {error && (
                        <div className="px-4 py-3 border border-status-critical/30 bg-status-critical/5 text-[#FF1636] font-mono text-[11px] uppercase tracking-wide flex items-center gap-3">
                            <AlertTriangle size={14} />
                            SYSTEM_ERROR: {error}
                        </div>
                    )}

                    {activeTab === "overview" && (
                        <>
                            <section>
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
                                <section className="flex flex-col bg-transparent border border-border-default overflow-hidden shadow-sm table-system-wrap h-full">
                                    <header className="rmm-panel-header border-b border-border-default bg-bg-secondary/30">
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

                                <section className="flex flex-col bg-bg-tertiary border border-border-default overflow-hidden shadow-sm table-system-wrap">
                                    <header className="rmm-panel-header border-b border-border-default bg-bg-secondary/30">
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
