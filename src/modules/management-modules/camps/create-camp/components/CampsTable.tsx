import type { CampRecord } from "../schemas/camp.schema";
import type { UserRecord } from "../schemas/user.schema";

function getUserLabel(user: UserRecord) {
    const displayName = user.username || user.name || `USER-${user.id ?? "N/A"}`;
    const profession = user.profession ? ` / ${user.profession}` : "";
    return `${displayName}${profession}`;
}

type CampsTableProps = {
    camps: CampRecord[];
    selectedId: number | null;
    adminById: Map<number, UserRecord>;
    onSelect: (id: number | null) => void;
};

export function CampsTable({ camps, selectedId, adminById, onSelect }: CampsTableProps) {
    return (
        <>
            <div className="grid grid-cols-[1fr_0.8fr_1fr_0.8fr] gap-2 px-4 py-2 bg-bg-tertiary text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-widest border-b border-border-default">
                {["Codigo", "Capacidad", "Administrador", "Estado"].map((header) => (
                    <div key={header}>{header}</div>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-border-subtle/30 bg-bg-primary/5">
                {camps.length === 0 ? (
                    <div className="py-20 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-txt-disabled italic">
                        NO SE ENCONTRARON CAMPAMENTOS.
                    </div>
                ) : (
                    camps.map((camp) => {
                        const isSelected = camp.id != null && camp.id === selectedId;
                        const admin = camp.admin_id == null ? null : adminById.get(camp.admin_id);

                        return (
                            <button
                                key={camp.id ?? camp.code}
                                type="button"
                                onClick={() => onSelect(camp.id ?? null)}
                                className={`grid grid-cols-[1fr_0.8fr_1fr_0.8fr] gap-2 px-4 py-3 w-full transition-all group items-center text-left ${
                                    isSelected
                                        ? "bg-accent/10 border-l-2 border-l-accent"
                                        : "hover:bg-bg-selected border-l-2 border-l-transparent text-txt-secondary hover:text-txt-primary"
                                }`}
                            >
                                <div className={`font-mono text-[11px] font-bold ${isSelected ? "text-accent" : "text-txt-primary"}`}>
                                    {camp.code}
                                </div>
                                <div className="font-mono text-[11px]">{camp.capacity}</div>
                                <div className="truncate font-mono text-[10px] uppercase opacity-70">
                                    {admin ? getUserLabel(admin) : <span className="text-status-critical italic">SIN ASIGNAR</span>}
                                </div>
                                <span className={`font-mono text-[10px] font-bold uppercase ${camp.state === "A" ? "text-status-ok" : "text-status-critical"}`}>
                                    {camp.state === "A" ? "Activo" : "Inactivo"}
                                </span>
                            </button>
                        );
                    })
                )}
            </div>
        </>
    );
}
