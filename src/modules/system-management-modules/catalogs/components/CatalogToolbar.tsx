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
        <div className="app-panel-header">
            <div>
                <div className="app-panel-title">Registry Control</div>
            </div>

            <div className="app-panel-actions">
                <label style={{ position: "relative", minWidth: 0, width: "12rem" }}>
                    <Search
                        size={13}
                        style={{ position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-txt-disabled)", pointerEvents: "none" }}
                    />
                    <input
                        className="app-input-default"
                        style={{ paddingLeft: "1.75rem" }}
                        value={search}
                        placeholder="Search catalog"
                        onChange={(event) => onSearchChange(event.target.value)}
                    />
                </label>
                <button type="button" className="app-btn app-btn--outline app-btn--sm" onClick={onRefresh} disabled={isLoading}>
                    <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>
        </div>
    );
}

export default CatalogToolbar;
