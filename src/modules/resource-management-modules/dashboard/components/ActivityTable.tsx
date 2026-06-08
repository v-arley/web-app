import { Activity } from "lucide-react";

interface ActivityItem {
    id: number;
    action: string;
    detail: string;
    username: string;
    created_at: string;
}

interface ActivityTableProps {
    items: ActivityItem[];
    isLoading?: boolean;
}

export function ActivityTable({ items = [], isLoading }: ActivityTableProps) {
    if (isLoading) {
        return (
            <div className="flex h-40 items-center justify-center bg-bg-secondary/10">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-5 w-5 border-2 border-txt-primary border-t-transparent animate-spin" />
                    <span className="font-mono text-[9px] text-txt-muted uppercase tracking-[0.2em]">Authenticating log stream...</span>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="py-16 text-center border border-border-default/50 bg-bg-secondary/5">
                <Activity size={24} className="mx-auto mb-3 text-txt-disabled opacity-30" />
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-txt-muted italic">NULL ACTIVITY RECORDED</p>
            </div>
        );
    }

    return (
        <table className="table-system">
            <thead className="table-system-head">
                <tr>
                    <th className="table-system-th">TIMESTAMP (UTC)</th>
                    <th className="table-system-th">OPERATION</th>
                    <th className="table-system-th">DATA_BLOB / CONTEXT</th>
                    <th className="table-system-th">AUTHOR_UID</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <tr key={item.id}>
                        <td className="table-system-td table-system-td--primary">
                            <span className="font-mono text-[11px] text-txt-muted">
                                {new Date(item.created_at).toISOString().replace('T', ' ').slice(0, 19)}
                            </span>
                        </td>
                        <td className="table-system-td table-system-td--primary">
                            <span className="font-mono font-bold text-[#08DC86] uppercase text-[11px]">
                                {item.action}
                            </span>
                        </td>
                        <td className="table-system-td table-system-td--primary">
                            <span className="font-mono text-[11px] text-txt-primary">
                                {item.detail}
                            </span>
                        </td>
                        <td className="table-system-td table-system-td--primary">
                            <span className="font-tech text-txt-secondary text-[11px] opacity-70">
                                {item.username.toUpperCase()}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
