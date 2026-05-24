import type { ResourceFormValues } from '../schemas/resource.schema';
import { useResourceTable } from '../hooks/useResourceTable';

type Props = {
    resources: ResourceFormValues[];
    selectedId?: number | null;
    onSelect?: (item: ResourceFormValues | undefined) => void;
};

function formatDate(value?: string | null) {
    if (!value) return "-";
    return new Date(value).toLocaleString("es-CR");
}

export function ResourceTable({
    resources,
    selectedId,
    onSelect,
}: Props) {
    const { handleSelect } = useResourceTable({ resources, selectedId, onSelect });
    const rows = resources;

    return (
        <div className="flex flex-col h-full w-full bg-bg-primary/5">
        <div className="grid grid-cols-[3rem_1fr_2fr_5rem_7rem] gap-2 px-4 py-2 bg-bg-tertiary text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-widest border-b border-border-default">
            <div>ID</div><div>Cat/Unidad</div><div>Codigo / Nombre</div><div>Estado</div><div>Registro</div>
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
                        className={`w-full text-left grid grid-cols-[3rem_1fr_2fr_5rem_7rem] gap-2 px-4 py-3 hover:bg-bg-secondary transition-colors items-center focus:outline-none focus:bg-bg-secondary text-xs text-txt-primary ${item.id === selectedId ? "bg-bg-secondary border-l-2 border-l-accent" : "border-l-2 border-l-transparent"}`}
                    >
                        
            <div>{item.id ?? "-"}</div>
            <div className="truncate">{item.category}<br/><span className="text-[9px] text-txt-secondary">{item.unitOfMeasure}</span></div>
            <div className="truncate">{item.code}<br/><span className="text-[9px] text-txt-secondary">{item.name}</span></div>
            <div>{item.state === 'A' ? 'ACTIVO' : 'INACTIVO'}</div>
            <div className="text-[9px] text-txt-secondary">{formatDate(item.created_at)}</div>
        
                    </button>
                ))
            )}
        </div>
    </div>
    );
}