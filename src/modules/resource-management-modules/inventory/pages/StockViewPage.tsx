import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";import { getAuthContextFromToken } from "../../../../shared/utils/authAccess";
import { StockFiltersPanel } from "../components/StockFiltersPanel";
import { StockTable } from "../components/StockTable";
import { useStockView } from "../hooks/useStockView";

function StockViewContent() {
    const authContext = getAuthContextFromToken();
    const campId = authContext.campId ?? 0;

    const [page, setPage] = useState(1);
    const pageSize = 50;

    const stockView = useStockView(campId, true);

    const handleClearFilters = () => {
        stockView.setCategoryFilter("");
        stockView.setStatusFilter("");
        stockView.setWarehouseFilter(null);
    };

    const totalRecords = stockView.filteredRecords.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    return (
        <div className="rmm-scope flex flex-col h-full bg-bg-app overflow-hidden">

            {/* Page header */}
            <header className="flex items-center justify-between px-4 py-2 border-b border-border-default bg-bg-tertiary shrink-0">
                <div>
                    <h3 className="text-[14px] font-bold text-txt-primary uppercase tracking-widest">
                        Asset Availability View
                    </h3>
                    <p className="text-[10px] font-mono text-txt-muted uppercase tracking-widest mt-1">
                        Node Frequency: <span className="text-accent">CAMP-ID {String(campId).padStart(3, '0')}</span> / Storage Status
                    </p>
                </div>
            </header>

            {/* Main section — full width */}
            <div className="flex-1 overflow-hidden">
                <section className="h-full flex flex-col bg-bg-tertiary border border-border-default overflow-hidden">

                    {/* Stream header: título izquierda — búsqueda + filtros derecha */}
                    <header className="flex items-center gap-3 px-4 py-2 border-b border-border-default bg-bg-secondary/30 shrink-0">
                        <h3 className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.2em] flex items-center gap-2 shrink-0">
                            <div className="w-1 h-3 bg-accent" />
                            Real-time Inventory Stream
                        </h3>

                        {/* Search + Filters — alineados al extremo derecho */}
                        <div className="ml-auto flex items-center gap-3">
                            <div className="relative w-48 shrink-0">
                                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-accent/60 pointer-events-none" />
                                <input
                                    type="search"
                                    placeholder="SCAN_RESOURCE_ID..."
                                    className="rmm-input !h-8 w-full pl-9 text-[10px] !bg-[#1c1c1c] !border-border-strong shadow-lg focus:!border-accent/80"
                                    value={stockView.search}
                                    onChange={(e) => stockView.setSearch(e.target.value)}
                                />
                            </div>

                            <StockFiltersPanel
                                categories={stockView.categories}
                                warehouses={stockView.warehouses}
                                selectedCategory={stockView.categoryFilter}
                                selectedStatus={stockView.statusFilter}
                                selectedWarehouse={stockView.warehouseFilter}
                                onCategoryChange={stockView.setCategoryFilter}
                                onStatusChange={stockView.setStatusFilter}
                                onWarehouseChange={stockView.setWarehouseFilter}
                                onClear={handleClearFilters}
                            />
                        </div>
                    </header>

                    {/* Table */}
                    <div className="flex-1 overflow-auto">
                        {stockView.isLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="h-6 w-6 border-2 border-accent border-t-transparent animate-spin" />
                                    <span className="font-mono text-[10px] text-txt-muted uppercase tracking-[0.4em]">Decrypting Ledger...</span>
                                </div>
                            </div>
                        ) : (
                            <StockTable
                                stocks={stockView.filteredRecords}
                                selectedWarehouseId={stockView.selected?.warehouse_id ?? null}
                                selectedResourceId={stockView.selected?.resource_id ?? null}
                                onSelect={stockView.selectByIds}
                            />
                        )}
                    </div>

                    {/* Footer: estado + paginación */}
                    <footer className="flex items-center justify-between px-4 py-1.5 border-t border-border-default bg-bg-secondary/30 shrink-0">
                        {/* Izquierda: total de registros + estado de sincronía */}
                        <div className="flex items-center gap-4 font-mono text-[9px] text-txt-muted uppercase tracking-widest">
                            <span>
                                Total: <span className="text-accent font-bold">{String(totalRecords).padStart(4, "0")}</span>
                            </span>
                            <span className="opacity-30">|</span>
                            <span>
                                Status: <span className="text-status-ok font-bold">[SYNCED]</span>
                            </span>
                        </div>

                        {/* Derecha: controles de paginación */}
                        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="px-2 py-1 border border-border-default text-txt-muted hover:border-accent hover:text-accent transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                                title="Página anterior"
                            >
                                ◄ PREV
                            </button>
                            <span className="px-3 py-1 border border-border-subtle text-txt-secondary tabular-nums">
                                {String(page).padStart(2, "0")}
                                <span className="text-txt-muted opacity-40 mx-1">/</span>
                                {String(totalPages).padStart(2, "0")}
                            </span>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className="px-2 py-1 border border-border-default text-txt-muted hover:border-accent hover:text-accent transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                                title="Página siguiente"
                            >
                                NEXT ►
                            </button>
                        </div>
                    </footer>
                </section>
            </div>
        </div>
    );
}


export function StockViewPage() {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <StockViewContent />
        </QueryClientProvider>
    );
}
