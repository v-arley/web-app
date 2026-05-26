import {
    Activity,
    CheckCircle2,
    ClipboardList,
    Package,
    ShieldCheck,
    UserCheck,
    XCircle,
} from "lucide-react";

import type { AuditLog } from "../../../models/AuditLog";

type Props = {
    loading: boolean;
    cancelledExplorations: number;
    finishedExplorations: number;
    consumableResources: number;
    inactiveResources: number;
    recentActivity?: AuditLog[];
};

function formatActivityTitle(log: AuditLog) {
    const tableName = log.table_name;
    const action = log.action;

    const detail =
        typeof log.new_values?.detail === "string"
            ? log.new_values.detail
            : undefined;

    if (detail) return detail;

    if (tableName === "admission_requests" && action === "UPDATE") {
        const status = log.new_values?.request_status;

        if (status === "A") return "Admission accepted";
        if (status === "R") return "Admission rejected";

        return "Admission request updated";
    }

    if (tableName === "users" && action === "INSERT") {
        return "User created";
    }

    if (tableName === "person_professions" && action === "INSERT") {
        return "Profession assigned";
    }

    if (tableName === "rations" && action === "INSERT") {
        return "Initial ration generated";
    }

    return `${tableName.replace(/_/g, " ")} ${action.toLowerCase()}`;
}

function formatActivityDate(value?: string | Date) {
    if (!value) return "No date";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "No date";

    return date.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getActivityIcon(log: AuditLog) {
    if (log.table_name === "admission_requests") {
        const status = log.new_values?.request_status;

        if (status === "A") {
            return <UserCheck size={12} className="text-status-ok" />;
        }

        if (status === "R") {
            return <XCircle size={12} className="text-status-danger" />;
        }

        return <ClipboardList size={12} className="text-status-info" />;
    }

    if (log.table_name === "users") {
        return <ShieldCheck size={12} className="text-status-ok" />;
    }

    if (log.table_name === "rations") {
        return <Package size={12} className="text-status-warning" />;
    }

    return <Activity size={12} className="text-txt-disabled" />;
}

export default function DashboardRightPanel({
    loading,
    cancelledExplorations,
    finishedExplorations,
    consumableResources,
    inactiveResources,
    recentActivity = [],
}: Props) {
    const summaryItems = [
        {
            label: "Cancelled Expl.",
            value: cancelledExplorations,
            icon: <XCircle size={10} className="text-txt-disabled" />,
        },
        {
            label: "Finished Expl.",
            value: finishedExplorations,
            icon: <CheckCircle2 size={10} className="text-status-info" />,
        },
        {
            label: "Consumable Res.",
            value: consumableResources,
            icon: <Package size={10} className="text-status-warning" />,
        },
        {
            label: "Inactive Res.",
            value: inactiveResources,
            icon: <XCircle size={10} className="text-txt-disabled" />,
        },
    ];

    const visibleActivity = recentActivity.slice(0, 5);

    return (
        <div className="flex flex-col gap-3">
            <div className="bg-bg-primary border border-border-default p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                        Recent activity
                    </span>

                    <Activity size={12} className="text-status-ok" />
                </div>

                {loading ? (
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-10 animate-pulse rounded bg-bg-secondary"
                            />
                        ))}
                    </div>
                ) : visibleActivity.length === 0 ? (
                    <div className="border border-border-subtle bg-bg-secondary p-3">
                        <p className="text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                            No recent activity
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {visibleActivity.map((log) => (
                            <div
                                key={String(log.id)}
                                className="border-b border-border-subtle pb-2 last:border-0 last:pb-0"
                            >
                                <div className="flex items-start gap-2">
                                    <div className="mt-0.5">
                                        {getActivityIcon(log)}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="line-clamp-2 text-[10px] font-mono font-bold uppercase tracking-label text-txt-secondary">
                                            {formatActivityTitle(log)}
                                        </p>

                                        <p className="mt-1 text-[10px] font-mono uppercase tracking-label text-txt-disabled">
                                            {formatActivityDate(log.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-bg-primary border border-border-default p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                        Activity summary
                    </span>

                    <ClipboardList size={12} className="text-status-info" />
                </div>

                <div className="flex flex-col gap-1">
                    {summaryItems.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between py-1 border-b border-border-subtle last:border-0 gap-1"
                        >
                            <div className="flex items-center gap-1.5">
                                {item.icon}

                                <span className="text-[10px] font-mono text-txt-secondary uppercase tracking-label">
                                    {item.label}
                                </span>
                            </div>

                            <span className="text-[12px] font-mono font-bold text-txt-primary">
                                {loading ? "—" : item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}