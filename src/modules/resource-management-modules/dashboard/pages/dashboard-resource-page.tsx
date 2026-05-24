import { Users, AlertTriangle, Utensils, Truck, RefreshCw } from "lucide-react";
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

    // Transformar datos de actividad para la tabla
    const activityItems = recentActivity.map((log) => ({
        id: log.id,
        action: log.action,
        detail: `${log.table_name} #${log.record_id || "N/A"}`,
        username: log.username || "Sistema",
        created_at: log.created_at,
    }));

    return (
        <div className="flex h-full flex-col p-4 md:p-6 bg-bg-app gap-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
                    Administración de Recursos / Dashboard
                </div>
                <button
                    onClick={refresh}
                    className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border-default hover:border-accent text-txt-primary text-[10px] font-mono uppercase tracking-widest transition-all"
                    disabled={isLoadingMetrics || isLoadingStock || isLoadingActivity}
                >
                    <RefreshCw size={14} className={isLoadingMetrics ? "animate-spin" : ""} />
                    Actualizar
                </button>
            </div>

            {error && (
                <div className="px-4 py-3 border border-status-critical/30 bg-status-critical/10 text-status-critical font-mono text-[11px] uppercase tracking-widest">
                    {error}
                </div>
            )}

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Población"
                    value={metrics?.population.current || 0}
                    subtitle={`Total disponible: ${metrics?.population.total || 0}`}
                    icon={<Users size={32} />}
                    variant="default"
                    showProgressBar
                    progressPercentage={metrics?.population.percentage || 0}
                />

                <MetricCard
                    title="Alertas Críticas"
                    value={metrics?.critical_alerts || 0}
                    subtitle="Stock bajo mínimo"
                    icon={<AlertTriangle size={32} />}
                    variant={
                        (metrics?.critical_alerts || 0) > 0
                            ? (metrics?.critical_alerts || 0) > 5
                                ? "critical"
                                : "warning"
                            : "success"
                    }
                />

                <MetricCard
                    title="Raciones Hoy"
                    value={`${metrics?.rations_today.delivered || 0} / ${metrics?.rations_today.total || 0}`}
                    subtitle={`${(metrics?.rations_today.percentage || 0).toFixed(1)}% entregadas`}
                    icon={<Utensils size={32} />}
                    variant="default"
                    showProgressBar
                    progressPercentage={metrics?.rations_today.percentage || 0}
                />

                <MetricCard
                    title="Envíos en Tránsito"
                    value={metrics?.shipments_in_transit || 0}
                    subtitle="Inter-campamentos"
                    icon={<Truck size={32} />}
                    variant="default"
                />
            </div>

            {/* Stock Summary Section */}
            <div className="flex flex-col bg-bg-secondary border border-border-default shadow-2xl relative">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

                <div className="flex items-center justify-between px-5 py-3 border-b border-border-default bg-bg-primary/30">
                    <div className="text-[11px] font-mono font-bold text-txt-primary uppercase tracking-[0.2em]">
                        Stock por Almacén - Bodega Principal
                    </div>
                    <div className="text-[10px] font-mono text-txt-disabled uppercase">
                        Top 10 Recursos
                    </div>
                </div>

                <div className="overflow-hidden">
                    <StockTable items={stockSummary} isLoading={isLoadingStock} />
                </div>
            </div>

            {/* Activity Log Section */}
            <div className="flex flex-col bg-bg-secondary border border-border-default shadow-2xl relative">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

                <div className="flex items-center justify-between px-5 py-3 border-b border-border-default bg-bg-primary/30">
                    <div className="text-[11px] font-mono font-bold text-txt-primary uppercase tracking-[0.2em]">
                        Actividad Reciente
                    </div>
                    <div className="text-[10px] font-mono text-txt-disabled uppercase">
                        Últimas 10 Acciones
                    </div>
                </div>

                <div className="overflow-hidden">
                    <ActivityTable items={activityItems} isLoading={isLoadingActivity} />
                </div>
            </div>

            {/* Implementation Notice */}
            {!isLoadingMetrics && metrics && metrics.population.current === 0 && (
                <div className="px-4 py-3 border border-status-warning/30 bg-status-warning/10 text-status-warning font-mono text-[11px] uppercase tracking-widest text-center">
                    ⚠️ Endpoint /dashboard-metrics pendiente de implementación en backend
                </div>
            )}
        </div>
    );
}
