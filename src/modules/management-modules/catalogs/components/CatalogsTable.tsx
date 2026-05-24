import type { AchievementFormValues } from "../schemas/achievement.schema";
import type { ProfessionFormValues } from "../schemas/profession.schema";
import type { ResourceFormValues } from "../schemas/resource.schema";
import type { CatalogTab } from "./CatalogsToolbar";

type CatalogsTableProps = {
    tab: CatalogTab;
    records: ProfessionFormValues[] | ResourceFormValues[] | AchievementFormValues[];
    selectedId: number | null;
    onSelect: (id: number | null) => void;
};

function StateBadge({ state }: { state: "A" | "I" }) {
    return (
        <span className={`font-mono text-[10px] font-bold uppercase ${state === "A" ? "text-status-ok" : "text-status-critical"}`}>
            {state === "A" ? "Activo" : "Inactivo"}
        </span>
    );
}

function formatCatalogDate(value?: string | null) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("es-CR");
}

export function CatalogsTable({ tab, records, selectedId, onSelect }: CatalogsTableProps) {
    const emptyText =
        tab === "professions"
            ? "No hay profesiones registradas."
            : tab === "resources"
              ? "No hay recursos registrados."
              : "No hay logros registrados.";

    if (records.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center p-16 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-txt-disabled italic">
                {emptyText}
            </div>
        );
    }

    if (tab === "professions") {
        return (
            <div className="flex flex-1 flex-col min-h-0">
                <div className="grid grid-cols-[80px_1fr_1.5fr_1fr_100px_80px] gap-4 px-6 py-3 bg-bg-tertiary/50 text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em] border-b border-border-default shrink-0">
                    {["Codigo", "Nombre", "Descripción", "Recurso", "Cant.", "Estado"].map((header) => (
                        <div key={header}>{header}</div>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-border-subtle/20 bg-bg-primary/5 custom-scrollbar">
                    {(records as ProfessionFormValues[]).map((record) => {
                        const isSelected = record.id != null && record.id === selectedId;
                        return (
                            <button
                                key={record.id ?? record.code}
                                type="button"
                                onClick={() => onSelect(record.id ?? null)}
                                className={`grid grid-cols-[80px_1fr_1.5fr_1fr_100px_80px] gap-4 px-6 py-4 w-full items-center text-left transition-all group ${
                                    isSelected 
                                        ? "bg-accent/15 border-l-2 border-l-accent shadow-[inset_4px_0_0_0_rgba(232,93,4,1)]" 
                                        : "hover:bg-bg-selected border-l-2 border-l-transparent"
                                }`}
                            >
                                <div className="font-mono text-[11px] font-bold text-accent group-hover:scale-110 transition-transform origin-left">{record.code}</div>
                                <div className="font-mono text-[12px] font-bold text-txt-primary uppercase truncate">{record.name}</div>
                                <div className="font-mono text-[10px] text-txt-secondary truncate opacity-70 group-hover:opacity-100 transition-opacity">{record.description || "N/A"}</div>
                                <div className="font-mono text-[10px] text-txt-secondary truncate uppercase">{record.default_resource_id ?? "-"}</div>
                                <div className="font-mono text-[10px] text-txt-secondary font-bold">{record.default_production_amount ?? "-"}</div>
                                <StateBadge state={record.state} />
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (tab === "resources") {
        return (
            <div className="flex flex-1 flex-col min-h-0">
                <div className="grid grid-cols-[80px_1fr_1fr_80px_60px_80px_120px] gap-4 px-6 py-3 bg-bg-tertiary/50 text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em] border-b border-border-default shrink-0">
                    {["Codigo", "Nombre", "Categoría", "Unidad", "Cons.", "Estado", "Alta"].map((header) => (
                        <div key={header}>{header}</div>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-border-subtle/20 bg-bg-primary/5 custom-scrollbar">
                    {(records as ResourceFormValues[]).map((record) => {
                        const isSelected = record.id != null && record.id === selectedId;
                        return (
                            <button
                                key={record.id ?? record.code}
                                type="button"
                                onClick={() => onSelect(record.id ?? null)}
                                className={`grid grid-cols-[80px_1fr_1fr_80px_60px_80px_120px] gap-4 px-6 py-4 w-full items-center text-left transition-all group ${
                                    isSelected 
                                        ? "bg-accent/15 border-l-2 border-l-accent shadow-[inset_4px_0_0_0_rgba(232,93,4,1)]" 
                                        : "hover:bg-bg-selected border-l-2 border-l-transparent"
                                }`}
                            >
                                <div className="font-mono text-[11px] font-bold text-accent group-hover:scale-110 transition-transform origin-left">{record.code}</div>
                                <div className="font-mono text-[12px] font-bold text-txt-primary uppercase truncate">{record.name}</div>
                                <div className="font-mono text-[10px] text-txt-secondary truncate uppercase opacity-80">{record.category || "GENERAL"}</div>
                                <div className="font-mono text-[10px] text-txt-secondary font-bold">{record.unitOfMeasure || "-"}</div>
                                <div className="font-mono text-[9px] text-txt-disabled font-bold">{record.consumable ? "✓" : "✗"}</div>
                                <StateBadge state={record.state} />
                                <div className="font-mono text-[10px] text-txt-secondary tabular-nums opacity-60">{formatCatalogDate(record.created_at)}</div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col min-h-0">
            <div className="grid grid-cols-[100px_1fr_1fr_1.5fr_60px_80px] gap-4 px-6 py-3 bg-bg-tertiary/50 text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em] border-b border-border-default shrink-0">
                {["Codigo", "Nombre", "Categoría", "Condición", "Pts", "Estado"].map((header) => (
                    <div key={header}>{header}</div>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border-subtle/20 bg-bg-primary/5 custom-scrollbar">
                {(records as AchievementFormValues[]).map((record) => {
                    const isSelected = record.id != null && record.id === selectedId;
                    return (
                        <button
                            key={record.id ?? record.code}
                            type="button"
                            onClick={() => onSelect(record.id ?? null)}
                            className={`grid grid-cols-[100px_1fr_1fr_1.5fr_60px_80px] gap-4 px-6 py-4 w-full items-center text-left transition-all group ${
                                isSelected 
                                    ? "bg-accent/15 border-l-2 border-l-accent shadow-[inset_4px_0_0_0_rgba(232,93,4,1)]" 
                                    : "hover:bg-bg-selected border-l-2 border-l-transparent"
                            }`}
                        >
                            <div className="font-mono text-[11px] font-bold text-accent group-hover:scale-110 transition-transform origin-left">{record.code}</div>
                            <div className="font-mono text-[12px] font-bold text-txt-primary uppercase truncate">{record.name}</div>
                            <div className="font-mono text-[10px] text-txt-secondary truncate uppercase opacity-80">{record.category || "GLOBAL"}</div>
                            <div className="font-mono text-[10px] text-status-info truncate font-bold">{record.condition_logic}</div>
                            <div className="font-mono text-[10px] text-accent font-bold tabular-nums">{record.points}</div>
                            <StateBadge state={record.state} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
