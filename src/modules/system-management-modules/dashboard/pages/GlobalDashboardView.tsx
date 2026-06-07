import { AlertTriangle, Boxes, BriefcaseBusiness, Map as MapIcon, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { useMemo } from "react";
import SystemFeedback from "../../shared/components/SystemFeedback";
import SystemModuleShell from "../../shared/components/SystemModuleShell";
import SystemMetricCard from "../components/SystemMetricCard";
import { useSystemDashboard } from "../hooks/useSystemDashboard";

export function GlobalDashboardView() {
    const dashboard = useSystemDashboard();
    const data = dashboard.data;

    const metrics = useMemo(() => {
        const camps = data?.camps ?? [];
        const users = data?.users ?? [];
        const resources = data?.resources ?? [];
        const professions = data?.professions ?? [];
        const activeCamps = camps.filter((camp) => camp.state !== "I" && camp.active !== false).length;
        const inactiveResources = resources.filter((resource) => resource.state === "I").length;
        const professionsWithoutResource = professions.filter((profession) => !profession.default_resource_id).length;
        const usersWithoutRoles = users.filter((user) => !user.roles || user.roles.length === 0).length;

        return {
            activeCamps,
            inactiveCamps: camps.length - activeCamps,
            totalUsers: users.length,
            resources: resources.length,
            inactiveResources,
            professions: professions.length,
            professionsWithoutResource,
            usersWithoutRoles,
        };
    }, [data]);

    const recentCamps = (data?.camps ?? []).slice(0, 8);
    const resourceCategories = useMemo(() => {
        const counts = new Map<string, number>();
        for (const resource of data?.resources ?? []) {
            counts.set(resource.category || "Uncategorized", (counts.get(resource.category || "Uncategorized") ?? 0) + 1);
        }
        return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    }, [data?.resources]);

    return (
        <SystemModuleShell
            title="Global Dashboard"
            subtitle="System Management"
            rightContent={
                <button type="button" className="rmm-btn rmm-btn-outline px-3 py-1.5 text-[10px]" onClick={() => void dashboard.refetch()} disabled={dashboard.isFetching}>
                    <RefreshCw size={13} className={dashboard.isFetching ? "animate-spin" : ""} />
                    Sync
                </button>
            }
        >
            <div className="flex-1 min-h-0 overflow-y-auto rmm-content-pad space-y-3">
                {dashboard.isError ? <SystemFeedback tone="error" message={dashboard.error.message} /> : null}

                <section className="rmm-kpi-stack">
                    <SystemMetricCard
                        label="Active Camps"
                        value={metrics.activeCamps}
                        subtitle={`${metrics.inactiveCamps} inactive`}
                        icon={<MapIcon size={22} />}
                        tone={metrics.inactiveCamps > 0 ? "warning" : "success"}
                    />
                    <SystemMetricCard
                        label="Registered Users"
                        value={metrics.totalUsers}
                        subtitle={`${metrics.usersWithoutRoles} without roles`}
                        icon={<Users size={22} />}
                        tone={metrics.usersWithoutRoles > 0 ? "warning" : "info"}
                    />
                    <SystemMetricCard
                        label="Resources"
                        value={metrics.resources}
                        subtitle={`${metrics.inactiveResources} inactive`}
                        icon={<Boxes size={22} />}
                        tone={metrics.inactiveResources > 0 ? "warning" : "success"}
                    />
                    <SystemMetricCard
                        label="Professions"
                        value={metrics.professions}
                        subtitle={`${metrics.professionsWithoutResource} without default resource`}
                        icon={<BriefcaseBusiness size={22} />}
                        tone={metrics.professionsWithoutResource > 0 ? "warning" : "success"}
                    />
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] gap-3">
                    <section className="flex flex-col bg-transparent border border-border-default overflow-hidden shadow-sm">
                        <header className="rmm-panel-header border-b border-border-default bg-bg-secondary/30 shrink-0">
                            <h2 className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide flex items-center gap-2">
                                <ShieldCheck size={15} className="text-accent" />
                                Camp Integrity
                            </h2>
                            <span className="font-mono text-[9px] text-txt-muted uppercase tracking-tighter">Latest records</span>
                        </header>
                        <div className="flex-1 min-h-0 overflow-auto">
                            <table className="rmm-table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Description</th>
                                        <th>Capacity</th>
                                        <th>Coordinates</th>
                                        <th>State</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboard.isLoading ? (
                                        <tr><td colSpan={5}>Loading system data...</td></tr>
                                    ) : recentCamps.length === 0 ? (
                                        <tr><td colSpan={5}>No camp data available.</td></tr>
                                    ) : (
                                        recentCamps.map((camp) => (
                                            <tr key={camp.id ?? camp.code}>
                                                <td className="font-mono font-bold uppercase text-txt-primary">{camp.code}
                                                    
                                                </td>
                                                <td className="font-mono text-txt-primary">{camp.description}
                                                    
                                                </td>
                                                <td className="font-mono text-txt-primary">{camp.capacity}
                                                    
                                                </td>
                                                <td className="font-mono text-txt-primary">{camp.location_x}, {camp.location_y}
                                                    
                                                </td>
                                                <td className="font-mono text-txt-primary">{camp.state ?? (camp.active ? "A" : "I")}
                                                    
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <aside className="flex min-w-0 flex-col gap-3">
                        <section className="flex flex-col bg-transparent border border-border-default overflow-hidden shadow-sm">
                            <header className="rmm-panel-header border-b border-border-default bg-bg-secondary/30 shrink-0">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={15} className="text-status-warning" />
                                    <h2 className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide">
                                    Integrity Signals
                                    </h2>
                                </div>
                            </header>
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-txt-secondary last:border-b-0">
                                    <span>Users without roles</span>
                                    <strong className="text-accent font-bold">{metrics.usersWithoutRoles}</strong>
                                </div>
                                <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-txt-secondary last:border-b-0">
                                    <span>Inactive resources</span>
                                    <strong className="text-accent font-bold">{metrics.inactiveResources}</strong>
                                </div>
                                <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-txt-secondary last:border-b-0">
                                    <span>Professions without resource</span>
                                    <strong className="text-accent font-bold">{metrics.professionsWithoutResource}</strong>
                                </div>
                            </div>
                        </section>

                        <section className="flex flex-col bg-transparent border border-border-default overflow-hidden shadow-sm">
                            <header className="rmm-panel-header border-b border-border-default bg-bg-secondary/30 shrink-0">
                                <h2 className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide">Resource Categories</h2>
                            </header>
                            <div className="flex flex-col p-3 gap-2">
                                {resourceCategories.length === 0 ? (
                                    <div className="flex flex-1 items-center justify-center p-6 text-txt-disabled font-mono text-xs uppercase tracking-wide">No resource categories.</div>
                                ) : (
                                    resourceCategories.map(([category, count]) => (
                                        <div key={category} className="flex items-center justify-between gap-3 border border-border-subtle bg-bg-secondary/20 px-3 py-2">
                                            <span className="min-w-0 truncate font-mono text-[11px] uppercase tracking-wide text-txt-secondary">{category}</span>
                                            <span className="sa-badge sa-badge--accent">{count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </SystemModuleShell>
    );
}
