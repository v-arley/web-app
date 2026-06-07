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

function PanelCard({
    title,
    icon,
    children,
}: {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="border border-border-default bg-bg-secondary">
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
                <p className="text-[12px] font-bold uppercase tracking-[0.17em] text-txt-primary">
                    {title}
                </p>

                {icon ? (
                    <div className="text-accent">
                        {icon}
                    </div>
                ) : null}
            </div>

            <div className="p-4">
                {children}
            </div>
        </section>
    );
}

function StatusLine({
    label,
    value,
    colorClass,
}: {
    label: string;
    value: number;
    colorClass: string;
}) {
    return (
        <div className="flex items-center justify-between border-b border-border-subtle/60 py-2 last:border-b-0">
            <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 ${colorClass}`} />

                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
                    {label}
                </span>
            </div>

            <span className="text-[13px] font-bold text-txt-primary">
                {value}
            </span>
        </div>
    );
}

function PriorityBar({
    label,
    value,
    max,
    colorClass,
}: {
    label: string;
    value: number;
    max: number;
    colorClass: string;
}) {
    const width = max > 0 ? Math.max((value / max) * 100, value > 0 ? 10 : 2) : 2;

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-txt-disabled">
                    {label}
                </span>

                <span className="text-[12px] font-bold text-txt-primary">
                    {value}
                </span>
            </div>

            <div className="h-2.5 bg-bg-primary">
                <div
                    className={`h-full ${colorClass}`}
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}

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
    const criticalCount = resourcesByStatus.C.length;
    const moderateCount = resourcesByStatus.M.length;
    const okCount = resourcesByStatus.O.length;
    const noneCount = resourcesByStatus.none.length;

    const maxPriority = Math.max(
        tasksByPriority.H.length,
        tasksByPriority.M.length,
        tasksByPriority.L.length,
        tasks.length - tasksByPriority.H.length - tasksByPriority.M.length - tasksByPriority.L.length,
        1,
    );

    const noPriorityCount = Math.max(
        tasks.length -
            tasksByPriority.H.length -
            tasksByPriority.M.length -
            tasksByPriority.L.length,
        0,
    );

    const totalPersons = Math.max(persons.length, 1);
    const activePercent = Math.round((activePersons / totalPersons) * 100);
    const inactivePercent = Math.round((inactivePersons / totalPersons) * 100);

    if (loading) {
        return (
            <div className="flex h-full flex-col gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-28 animate-pulse border border-border-default bg-bg-secondary"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col gap-4">
            <PanelCard
                title="Resources"
                icon={<Package size={15} />}
            >
                <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4">
                    <div className="flex h-24 w-24 flex-col items-center justify-center border border-border-default bg-bg-primary">
                        <span className="text-[30px] font-bold leading-none text-txt-primary">
                            {totalResources}
                        </span>

                        <span className="mt-2 text-[10px] uppercase tracking-[0.14em] text-txt-disabled">
                            Total
                        </span>
                    </div>

                    <div className="min-w-0">
                        <StatusLine
                            label="Critical"
                            value={criticalCount}
                            colorClass="bg-status-critical"
                        />

                        <StatusLine
                            label="Moderate"
                            value={moderateCount}
                            colorClass="bg-status-warning"
                        />

                        <StatusLine
                            label="Ok"
                            value={okCount}
                            colorClass="bg-status-ok"
                        />

                        <StatusLine
                            label="N/A"
                            value={noneCount}
                            colorClass="bg-txt-disabled"
                        />
                    </div>
                </div>
            </PanelCard>

            <PanelCard
                title="Critical Resources"
                icon={<AlertTriangle size={15} />}
            >
                {criticalCount > 0 ? (
                    <div className="space-y-2">
                        {resourcesByStatus.C.slice(0, 4).map((resource) => (
                            <div
                                key={resource.id}
                                className="flex items-center justify-between border border-status-critical/40 bg-bg-primary px-3 py-2"
                            >
                                <span className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-status-critical">
                                    {resource.name}
                                </span>

                                <span className="text-[10px] uppercase tracking-[0.12em] text-txt-disabled">
                                    {resource.code}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-status-ok">
                        <CheckCircle2 size={15} />

                        <span className="text-[12px] font-bold uppercase tracking-[0.14em]">
                            All clear
                        </span>
                    </div>
                )}
            </PanelCard>

            <PanelCard
                title="Tasks by Priority"
                icon={<ClipboardList size={15} />}
            >
                <div className="space-y-3">
                    <PriorityBar
                        label="High"
                        value={tasksByPriority.H.length}
                        max={maxPriority}
                        colorClass="bg-accent"
                    />

                    <PriorityBar
                        label="Med"
                        value={tasksByPriority.M.length}
                        max={maxPriority}
                        colorClass="bg-status-warning"
                    />

                    <PriorityBar
                        label="Low"
                        value={tasksByPriority.L.length}
                        max={maxPriority}
                        colorClass="bg-status-info"
                    />

                    <PriorityBar
                        label="N/A"
                        value={noPriorityCount}
                        max={maxPriority}
                        colorClass="bg-txt-disabled"
                    />
                </div>
            </PanelCard>

            <PanelCard
                title="Personnel"
                icon={<Users size={15} />}
            >
                <div className="grid grid-cols-2 gap-3">
                    <div className="border border-border-subtle bg-bg-primary px-3 py-3 text-center">
                        <p className="text-[24px] font-bold leading-none text-status-ok">
                            {activePercent}%
                        </p>

                        <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-txt-disabled">
                            Active
                        </p>

                        <p className="mt-1 text-[12px] font-bold text-txt-primary">
                            {activePersons}
                        </p>
                    </div>

                    <div className="border border-border-subtle bg-bg-primary px-3 py-3 text-center">
                        <p className="text-[24px] font-bold leading-none text-txt-disabled">
                            {inactivePercent}%
                        </p>

                        <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-txt-disabled">
                            Inactive
                        </p>

                        <p className="mt-1 text-[12px] font-bold text-txt-primary">
                            {inactivePersons}
                        </p>
                    </div>
                </div>
            </PanelCard>
        </div>
    );
}