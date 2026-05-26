import KpiCard from "./KpiCard";

type Props = {
    loading: boolean;
    activePersons: number;
    inactivePersons: number;
    totalResources: number;
    criticalResources: number;
    activeExplorations: number;
    pendingExplorations: number;
    highPriorityTasks: number;
    totalTasks: number;
};

export default function DashboardKpiSection({
    loading,
    activePersons,
    inactivePersons,
    totalResources,
    criticalResources,
    activeExplorations,
    pendingExplorations,
    highPriorityTasks,
    totalTasks,
}: Props) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard
                label="Active Personnel"
                value={activePersons}
                sub={`${inactivePersons} inactive`}
                loading={loading}
            />

            <KpiCard
                label="Total Resources"
                value={totalResources}
                sub={`${criticalResources} critical`}
                accent={criticalResources > 0}
                loading={loading}
            />

            <KpiCard
                label="Active Explorations"
                value={activeExplorations}
                sub={`${pendingExplorations} pending`}
                accent={activeExplorations > 0}
                loading={loading}
            />

            <KpiCard
                label="High Priority Tasks"
                value={highPriorityTasks}
                sub={`${totalTasks} total tasks`}
                accent={highPriorityTasks > 0}
                loading={loading}
            />
        </div>
    );
}