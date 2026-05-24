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

export function ActivityTable({ items, isLoading }: ActivityTableProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="h-4 w-4 animate-spin border-2 border-accent border-t-transparent rounded-full" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-txt-disabled">
                <Activity size={32} className="mb-2 opacity-40" />
                <p className="text-[11px] font-mono uppercase tracking-widest">Sin actividad reciente</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-border-default bg-bg-primary/30">
                        <th className="text-left py-3 px-4 text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-[0.15em]">
                            Hora UTC
                        </th>
                        <th className="text-left py-3 px-4 text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-[0.15em]">
                            Acción
                        </th>
                        <th className="text-left py-3 px-4 text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-[0.15em]">
                            Detalle
                        </th>
                        <th className="text-left py-3 px-4 text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-[0.15em]">
                            Usuario
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr
                            key={item.id}
                            className="border-b border-border-default/50 hover:bg-bg-primary/20 transition-colors"
                        >
                            <td className="py-3 px-4">
                                <span className="text-[10px] font-mono text-txt-secondary">
                                    {new Date(item.created_at).toLocaleString("en-GB", {
                                        timeZone: "UTC",
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    })}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span className="text-[11px] font-mono font-bold text-accent uppercase">
                                    {item.action}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span className="text-[10px] font-mono text-txt-primary">
                                    {item.detail}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span className="text-[10px] font-mono text-txt-secondary">
                                    {item.username}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
