import { Loader2 } from "lucide-react";
import type { CampRecord } from "../schemas/camp.schema";

type CampsTableProps = {
    camps: CampRecord[];
    selectedId: number | null;
    isLoading: boolean;
    adminNameById: Map<number, string>;
    onSelect: (id: number) => void;
};

export function CampsTable({ camps, selectedId, isLoading, adminNameById, onSelect }: CampsTableProps) {
    if (isLoading) {
        return (
            <div className="app-loading-state app-animate-fade">
                <Loader2 className="animate-spin" size={18} style={{ marginRight: "0.5rem" }} />
                Loading...
            </div>
        );
    }

    if (camps.length === 0) {
        return (
            <div className="app-empty-state app-animate-fade">
                <span>No camps found</span>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 overflow-auto app-table-frame">
            <table className="app-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Code</th>
                        <th>Description</th>
                        <th>Capacity</th>
                        <th>Admin</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody className="app-stagger-rows">
                    {camps.map((camp) => {
                        const id = camp.id ?? null;
                        const selected = id != null && id === selectedId;
                        const adminId = camp.admin_id ?? camp.user_admin_id ?? null;

                        return (
                            <tr
                                key={id ?? camp.code}
                                tabIndex={0}
                                onClick={() => id != null && onSelect(id)}
                                onKeyDown={(event) => {
                                    if (id != null && (event.key === "Enter" || event.key === " ")) {
                                        event.preventDefault();
                                        onSelect(id);
                                    }
                                }}
                                className={`app-table-row ${selected ? "app-table-row--selected" : ""}`}
                            >
                                <td className="app-table-cell--code">{id ?? "AUTO"}</td>
                                <td className="app-table-cell--primary">{camp.code}</td>
                                <td>{camp.description}</td>
                                <td className="app-table-cell--number">{camp.capacity}</td>
                                <td>{adminId != null ? adminNameById.get(adminId) ?? `User #${adminId}` : "None"}</td>
                                <td>
                                    <span className={`app-table-badge ${camp.state === "I" ? "app-table-badge--error" : "app-table-badge--ok"}`}>
                                        {camp.state ?? (camp.active ? "A" : "I")}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default CampsTable;