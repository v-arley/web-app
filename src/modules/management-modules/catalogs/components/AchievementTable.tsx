import type { AchievementFormValues } from '../schemas/achievement.schema';
import { useAchievementTable } from '../hooks/useAchievementTable';

type Props = {
    achievements: AchievementFormValues[];
    selectedId?: number | null;
    onSelect?: (item: AchievementFormValues | undefined) => void;
};

export function AchievementTable({
    achievements,
    selectedId,
    onSelect,
}: Props) {
    const { handleSelect } = useAchievementTable({ achievements, selectedId, onSelect });
    const rows = achievements;

    return (
        <div className="flex flex-col h-full w-full bg-bg-primary/5">
        <div className="grid grid-cols-[3rem_2fr_2fr_3rem_5rem] gap-2 px-4 py-2 bg-bg-tertiary text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-widest border-b border-border-default">
            <div>ID</div><div>Codigo / Nombre</div><div>Requisito</div><div>Pts</div><div>Estado</div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border-default/30">
            {rows.length === 0 ? (
                <div className="p-4 text-center text-xs text-txt-secondary">
                    No hay registros.
                </div>
            ) : (
                rows.map((item) => (
                    <button
                        key={item.id ?? item.code}
                        onClick={() => handleSelect(item)}
                        className={`w-full text-left grid grid-cols-[3rem_2fr_2fr_3rem_5rem] gap-2 px-4 py-3 hover:bg-bg-secondary transition-colors items-center focus:outline-none focus:bg-bg-secondary text-xs text-txt-primary ${item.id === selectedId ? "bg-bg-secondary border-l-2 border-l-accent" : "border-l-2 border-l-transparent"}`}
                    >
                        
            <div>{item.id ?? "-"}</div>
            <div className="truncate">{item.code}<br/><span className="text-[9px] text-txt-secondary">{item.name}</span></div>
            <div className="truncate text-[9px] text-txt-secondary">{item.condition_logic}</div>
            <div>{item.points}</div>
            <div>{item.state === 'A' ? 'ACTIVO' : 'INACTIVO'}</div>
        
                    </button>
                ))
            )}
        </div>
    </div>
    );
}