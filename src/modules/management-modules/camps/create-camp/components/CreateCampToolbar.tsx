import { RotateCcw, Search } from "lucide-react";

type CreateCampToolbarProps = {
    search: string;
    onSearchChange: (value: string) => void;
    totalRows: number;
    isLoading: boolean;
    isSaving: boolean;
    onRefresh: () => void;
};

export function CreateCampToolbar({
    search,
    onSearchChange,
    totalRows,
    isLoading,
    isSaving,
    onRefresh,
}: CreateCampToolbarProps) {
    return (
        <>
            <div className="relative p-3 border-b border-border-subtle bg-bg-primary/30">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-txt-disabled" size={14} />
                <input
                    type="search"
                    placeholder="BUSCAR POR CODIGO O ADMINISTRADOR..."
                    className="w-full bg-bg-tertiary border border-border-default pl-10 pr-4 py-2 text-[11px] font-mono text-txt-primary placeholder:text-txt-disabled focus:border-accent outline-none transition-all uppercase tracking-wider"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                />
            </div>

            <div className="flex items-center justify-between px-4 py-2 bg-bg-tertiary/50 border-b border-border-subtle">
                <div className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">
                    Campamentos Registrados
                </div>

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={isLoading || isSaving}
                    className="flex items-center gap-2 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest bg-bg-secondary border border-border-default hover:border-accent hover:text-accent transition-all disabled:opacity-50"
                >
                    <RotateCcw size={10} className={isLoading ? "animate-spin" : ""} />
                    <span>Actualizar</span>
                </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-bg-tertiary border-t border-border-default">
                <span className="font-mono text-[10px] text-txt-disabled uppercase tracking-widest">
                    REGISTROS: {String(totalRows).padStart(4, "0")}
                </span>
            </div>
        </>
    );
}
