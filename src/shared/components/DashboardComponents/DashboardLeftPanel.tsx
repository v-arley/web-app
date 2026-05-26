import {
    AlertTriangle,
    CheckCircle2,
    ClipboardList,
    Package,
    Users,
} from "lucide-react";

import type { Person } from "../../../models/Person";
import type { Resource } from "../../../models/Resource";
import type { Task } from "../../../models/Task";

import {
    DonutChart,
    MiniGauge,
    VerticalBarChart,
} from "./DashboardCharts";

type Props = {
    loading: boolean;
    persons: Person[];
    resourcesByStatus: {
        C: Resource[];
        M: Resource[];
        O: Resource[];
        none: Resource[];
    };
    totalResources: number;
    tasks: Task[];
    tasksByPriority: {
        H: Task[];
        M: Task[];
        L: Task[];
    };
    activePersons: number;
    inactivePersons: number;
};

export default function DashboardLeftPanel({
    loading,
    persons,
    resourcesByStatus,
    totalResources,
    tasks,
    tasksByPriority,
    activePersons,
    inactivePersons,
}: Props) {
    return (
        <div className="flex flex-col gap-3">
            <div className="bg-bg-primary border border-border-default p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                        Resources
                    </span>

                    <Package size={12} className="text-accent" />
                </div>

                {loading ? (
                    <span className="text-[11px] font-mono text-txt-disabled animate-pulse">
                        Loading...
                    </span>
                ) : totalResources === 0 ? (
                    <span className="text-[11px] font-mono text-txt-disabled uppercase tracking-label">
                        No resources.
                    </span>
                ) : (
                    <DonutChart
                        size={110}
                        strokeWidth={14}
                        segments={[
                            {
                                label: "Critical",
                                value: resourcesByStatus.C.length,
                                color: "#E85D04",
                            },
                            {
                                label: "Moderate",
                                value: resourcesByStatus.M.length,
                                color: "#FACC15",
                            },
                            {
                                label: "Ok",
                                value: resourcesByStatus.O.length,
                                color: "#F59E0B",
                            },
                            ...(resourcesByStatus.none.length > 0
                                ? [
                                      {
                                          label: "N/A",
                                          value: resourcesByStatus.none.length,
                                          color: "#555555",
                                      },
                                  ]
                                : []),
                        ]}
                        centerValue={totalResources}
                        centerLabel="Total"
                    />
                )}
            </div>

            <div className="bg-bg-primary border border-border-default p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                        Critical Resources
                    </span>

                    <AlertTriangle
                        size={12}
                        className="text-status-critical"
                    />
                </div>

                {loading ? (
                    <span className="text-[11px] font-mono text-txt-disabled animate-pulse">
                        Loading...
                    </span>
                ) : resourcesByStatus.C.length === 0 ? (
                    <div className="flex items-center gap-2 py-1">
                        <CheckCircle2
                            size={11}
                            className="text-status-ok"
                        />

                        <span className="text-[10px] font-mono text-status-ok uppercase tracking-label">
                            All clear
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {resourcesByStatus.C.slice(0, 4).map((resource) => (
                            <div
                                key={resource.id}
                                className="flex items-center justify-between py-1 border-b border-border-subtle last:border-0"
                            >
                                <span className="text-[11px] font-mono font-bold text-txt-primary uppercase truncate">
                                    {resource.name}
                                </span>

                                <span className="text-[9px] font-mono font-bold text-status-critical bg-status-critical/10 px-1.5 py-0.5 uppercase shrink-0">
                                    CRIT
                                </span>
                            </div>
                        ))}

                        {resourcesByStatus.C.length > 4 && (
                            <span className="text-[9px] font-mono text-txt-disabled uppercase tracking-label">
                                +{resourcesByStatus.C.length - 4} more
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-bg-primary border border-border-default p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                        Tasks by Priority
                    </span>

                    <ClipboardList size={12} className="text-accent" />
                </div>

                {loading ? (
                    <span className="text-[11px] font-mono text-txt-disabled animate-pulse">
                        Loading...
                    </span>
                ) : tasks.length === 0 ? (
                    <span className="text-[11px] font-mono text-txt-disabled uppercase tracking-label">
                        No tasks.
                    </span>
                ) : (
                    <VerticalBarChart
                        bars={[
                            {
                                label: "High",
                                value: tasksByPriority.H.length,
                                color: "#E85D04",
                            },
                            {
                                label: "Med",
                                value: tasksByPriority.M.length,
                                color: "#FACC15",
                            },
                            {
                                label: "Low",
                                value: tasksByPriority.L.length,
                                color: "#F59E0B",
                            },
                            {
                                label: "N/A",
                                value: tasks.filter((task) => !task.priority)
                                    .length,
                                color: "#555555",
                            },
                        ]}
                        height={90}
                    />
                )}
            </div>

            <div className="bg-bg-primary border border-border-default p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                        Personnel
                    </span>

                    <Users size={12} className="text-accent" />
                </div>

                {loading ? (
                    <span className="text-[11px] font-mono text-txt-disabled animate-pulse">
                        Loading...
                    </span>
                ) : persons.length === 0 ? (
                    <span className="text-[11px] font-mono text-txt-disabled uppercase tracking-label">
                        No personnel.
                    </span>
                ) : (
                    <div className="flex items-center justify-center gap-4">
                        <MiniGauge
                            value={activePersons}
                            max={persons.length}
                            label="Active"
                            color="#F59E0B"
                        />

                        <MiniGauge
                            value={inactivePersons}
                            max={persons.length}
                            label="Inactive"
                            color="#6B7280"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}