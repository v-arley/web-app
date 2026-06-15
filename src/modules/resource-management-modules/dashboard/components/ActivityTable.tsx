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
            <div className="app-loading-state app-animate-fade" style={{ flexDirection: "column", gap: "0.5rem" }}>
                <div className="app-spinner" />
                <span className="app-eyebrow" style={{ letterSpacing: "0.22em" }}>Authenticating log stream...</span>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="app-empty-state app-animate-fade">
                <Activity size={24} />
                <span>Null activity recorded</span>
            </div>
        );
    }

    return (
        <div className="app-table-wrap">
        <table className="app-table">
            <thead>
                <tr>
                    <th>Timestamp (UTC)</th>
                    <th>Operation</th>
                    <th>Context</th>
                    <th>Author</th>
                </tr>
            </thead>
            <tbody className="app-stagger-rows">
                {items.map((item) => (
                    <tr key={item.id}>
                        <td className="app-table-cell--time">
                            {new Date(item.created_at).toISOString().replace('T', ' ').slice(0, 19)}
                        </td>
                        <td>
                            <span className="app-table-badge app-table-badge--ok">
                                {item.action}
                            </span>
                        </td>
                        <td className="app-table-cell--code">
                            {item.detail}
                        </td>
                        <td className="app-table-cell--time">
                            {item.username.toUpperCase()}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
}
