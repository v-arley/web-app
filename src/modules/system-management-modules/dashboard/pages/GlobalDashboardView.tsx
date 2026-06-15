import { AlertTriangle, Boxes, BriefcaseBusiness, Map as MapIcon, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useToast } from "../../../../shared/hooks/useToast";
import SystemModuleShell from "../../shared/components/SystemModuleShell";
import SystemMetricCard from "../components/SystemMetricCard";
import { useSystemDashboard } from "../hooks/useSystemDashboard";

export function GlobalDashboardView() {
    const dashboard = useSystemDashboard();
    const { toast } = useToast();
    const data = dashboard.data;

    useEffect(() => {
        if (dashboard.isError) {
            toast({ tone: "error", title: "Dashboard", message: dashboard.error.message });
        }
    }, [dashboard.error, dashboard.isError, toast]);

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
                <button
                    type="button"
                    className="app-btn app-btn--outline app-btn--sm"
                    onClick={() => void dashboard.refetch()}
                    disabled={dashboard.isFetching}
                >
                    <RefreshCw size={13} className={dashboard.isFetching ? "animate-spin" : ""} />
                    Sync
                </button>
            }
        >
            <div className="app-content-body app-content-body--gap" style={{ overflowY: "auto" }}>
                <section className="app-kpi-stack app-stagger">
                    <SystemMetricCard
                        label="Active Camps"
                        value={metrics.activeCamps}
                        subtitle={`${metrics.inactiveCamps} inactive`}
                        icon={<MapIcon size={20} />}
                        tone={metrics.inactiveCamps > 0 ? "warning" : "success"}
                    />
                    <SystemMetricCard
                        label="Registered Users"
                        value={metrics.totalUsers}
                        subtitle={`${metrics.usersWithoutRoles} without roles`}
                        icon={<Users size={20} />}
                        tone={metrics.usersWithoutRoles > 0 ? "warning" : "info"}
                    />
                    <SystemMetricCard
                        label="Resources"
                        value={metrics.resources}
                        subtitle={`${metrics.inactiveResources} inactive`}
                        icon={<Boxes size={20} />}
                        tone={metrics.inactiveResources > 0 ? "warning" : "success"}
                    />
                    <SystemMetricCard
                        label="Professions"
                        value={metrics.professions}
                        subtitle={`${metrics.professionsWithoutResource} without resource`}
                        icon={<BriefcaseBusiness size={20} />}
                        tone={metrics.professionsWithoutResource > 0 ? "warning" : "success"}
                    />
                </section>

                <div className="app-responsive-columns app-responsive-columns--two">
                    <section className="app-panel">
                        <header className="app-panel-header">
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <ShieldCheck size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                                <span className="app-panel-title">Camp Integrity</span>
                            </div>
                            <span className="app-panel-subtitle">Latest records</span>
                        </header>
                        <div className="flex-1 min-h-0 overflow-auto">
                            {/* Mobile card view */}
                            <div className="sm:hidden">
                                {dashboard.isLoading ? (
                                    <div className="app-loading-state p-8" style={{ justifyContent: "center" }}>Loading system data...</div>
                                ) : recentCamps.length === 0 ? (
                                    <div className="app-empty-state p-8" style={{ height: "auto" }}>No camp data available.</div>
                                ) : (
                                    <div className="divide-y divide-border-default">
                                        {recentCamps.map((camp) => (
                                            <div key={camp.id ?? camp.code} className="flex flex-col gap-1.5 p-4">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="app-table-cell--primary font-mono text-[11px] font-bold">{camp.code}</span>
                                                    <span className={`app-table-badge ${camp.state === "I" ? "app-table-badge--error" : "app-table-badge--ok"}`}>
                                                        {camp.state ?? (camp.active ? "A" : "I")}
                                                    </span>
                                                </div>
                                                <p className="font-mono text-[11px] text-txt-secondary">{camp.description}</p>
                                                <span className="font-mono text-[10px] text-txt-muted">Capacity: {camp.capacity}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Desktop table view */}
                            <div className="hidden sm:block app-table-frame">
                                <table className="app-table">
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Description</th>
                                            <th>Capacity</th>
                                            <th>Coordinates</th>
                                            <th>State</th>
                                        </tr>
                                    </thead>
                                    <tbody className="app-stagger-rows">
                                        {dashboard.isLoading ? (
                                            <tr>
                                                <td colSpan={5} style={{ padding: "2rem", textAlign: "center" }}>
                                                    <div className="app-loading-state" style={{ justifyContent: "center" }}>Loading system data...</div>
                                                </td>
                                            </tr>
                                        ) : recentCamps.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} style={{ padding: "2rem", textAlign: "center" }}>
                                                    <div className="app-empty-state" style={{ height: "auto" }}>No camp data available.</div>
                                                </td>
                                            </tr>
                                        ) : (
                                            recentCamps.map((camp) => (
                                                <tr key={camp.id ?? camp.code}>
                                                    <td className="app-table-cell--primary">{camp.code}</td>
                                                    <td>{camp.description}</td>
                                                    <td className="app-table-cell--number">{camp.capacity}</td>
                                                    <td className="app-table-cell--code">{camp.location_x}, {camp.location_y}</td>
                                                    <td>
                                                        <span className={`app-table-badge ${camp.state === "I" ? "app-table-badge--error" : "app-table-badge--ok"}`}>
                                                            {camp.state ?? (camp.active ? "A" : "I")}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <aside style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: 0 }}>
                        <section className="app-panel">
                            <header className="app-panel-header">
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <AlertTriangle size={14} style={{ color: "var(--color-status-warning)", flexShrink: 0 }} />
                                    <span className="app-panel-title">Integrity Signals</span>
                                </div>
                            </header>
                            <div>
                                {[
                                    { label: "Users without roles", value: metrics.usersWithoutRoles },
                                    { label: "Inactive resources",  value: metrics.inactiveResources },
                                    { label: "Professions without resource", value: metrics.professionsWithoutResource },
                                ].map(({ label, value }) => (
                                    <div
                                        key={label}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: "0.75rem",
                                            padding: "0.75rem 1rem",
                                            borderBottom: "1px solid var(--color-border-subtle)",
                                        }}
                                    >
                                        <span className="app-muted">{label}</span>
                                        <strong style={{ color: "var(--color-accent)", fontWeight: 700 }}>{value}</strong>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="app-panel">
                            <header className="app-panel-header">
                                <span className="app-panel-title">Resource Categories</span>
                            </header>
                            <div className="app-panel-body" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                {resourceCategories.length === 0 ? (
                                    <div className="app-empty-state">No resource categories.</div>
                                ) : (
                                    resourceCategories.map(([category, count]) => (
                                        <div
                                            key={category}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: "0.75rem",
                                                padding: "0.5rem 0.75rem",
                                                border: "1px solid var(--color-border-subtle)",
                                                background: "color-mix(in srgb, var(--color-bg-secondary) 20%, transparent)",
                                            }}
                                        >
                                            <span className="app-code">{category}</span>
                                            <span className="app-badge app-badge--accent">{count}</span>
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
