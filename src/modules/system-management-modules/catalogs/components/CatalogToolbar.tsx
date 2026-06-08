import { RefreshCw, Search } from "lucide-react";

type CatalogToolbarProps = {
    search: string;
    total: number;
    isLoading: boolean;
    onSearchChange: (value: string) => void;
    onRefresh: () => void;
};

export function CatalogToolbar({ search, total, isLoading, onSearchChange, onRefresh }: CatalogToolbarProps) {
    return (
        <div className="rmm-panel-header border-b border-border-default bg-bg-secondary/30 shrink-0">
            <div>
                <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide">Registry Control</div>
                <div className="font-mono text-[11px] text-txt-muted uppercase tracking-widest mt-0.5">{total} records in current scope</div>
            </div>

            <div className="rmm-panel-actions">
                <label className="relative min-w-0 w-full sm:w-48">
                    <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-txt-muted" size={14} />
                    <input
                        className="rmm-input pl-7 py-1 text-[11px]"
                        value={search}
                        placeholder="Search catalog"
                        onChange={(event) => onSearchChange(event.target.value)}
                    />
                </label>
                <button type="button" className="rmm-btn rmm-btn-outline px-3 py-1.5 text-[10px]" onClick={onRefresh} disabled={isLoading}>
                    <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>
        </div>
    );
}

export default CatalogToolbar;
