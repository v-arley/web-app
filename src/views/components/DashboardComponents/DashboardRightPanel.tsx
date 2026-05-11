import {
    Activity,
    CheckCircle2,
    Package,
    XCircle,
} from "lucide-react";

type Props = {
    loading: boolean;
    cancelledExplorations: number;
    finishedExplorations: number;
    consumableResources: number;
    inactiveResources: number;
};

export default function DashboardRightPanel({
    loading,
    cancelledExplorations,
    finishedExplorations,
    consumableResources,
    inactiveResources,
}: Props) {
    const items = [
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

    return (
        <div className="flex flex-col gap-3">
            <div className="bg-bg-primary border border-border-default p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                        Activity
                    </span>

                    <Activity size={12} className="text-status-ok" />
                </div>

                <div className="flex flex-col gap-1">
                    {items.map((item) => (
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