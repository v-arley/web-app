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
            <div className="flex flex-1 items-center justify-center gap-2 p-6 text-txt-disabled font-mono text-xs uppercase tracking-wide">
                <Loader2 className="animate-spin" size={18} />
            </div>
        );
    }

    if (camps.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center p-6 text-txt-disabled font-mono text-xs uppercase tracking-wide">
                No camps found
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 overflow-auto">
            <table className="rmm-table">
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
                <tbody>
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
                                className={`cursor-pointer select-none transition-colors ${
                                    selected
                                        ? "bg-accent/10 border-l-2 border-l-accent"
                                        : "hover:bg-bg-secondary/50 border-l-2 border-l-transparent"
                                }`}
                            >
                                <td className="font-mono text-txt-primary">
                                    {id ?? "AUTO"}
                                    </td>
                                <td className="font-mono font-bold uppercase text-txt-primary">
                                    {camp.code}
                                    </td>
                                <td className="font-mono text-txt-primary">
                                    {camp.description}
                                    </td>
                                <td className="font-mono text-txt-primary">
                                    {camp.capacity}
                                    </td>
                                <td className="font-mono text-txt-primary">
                                    {adminId != null ? adminNameById.get(adminId) ?? `User #${adminId}` : "None"}
                                    </td>
                                <td className="font-mono text-txt-primary">
                                    {camp.state ?? (camp.active ? "A" : "I")}
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
