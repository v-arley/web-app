import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { getAuthContextFromToken } from "../../../../utils/authAccess";
import { StockFiltersPanel } from "../components/StockFiltersPanel";
import { StockStatusBadge } from "../components/StockStatusBadge";
import { StockTable } from "../components/StockTable";
import { useStockView } from "../hooks/useStockView";

function AlertBanner({ tone, message }: { tone: "error" | "success" | "info"; message: string }) {
    const toneClassName =
        tone === "error"
            ? "bg-status-critical/10 border-status-critical/30 text-status-critical"
            : tone === "success"
            ? "bg-status-ok/10 border-status-ok/30 text-status-ok"
            : "bg-status-info/10 border-status-info/30 text-status-info";

    return (
        <div className={`px-4 py-3 border font-mono text-[11px] uppercase tracking-widest ${toneClassName}`}>
            {message}
        </div>
    );
}

function StockViewContent() {
    const authContext = getAuthContextFromToken();
    const campId = authContext.campId ?? 0;

    const [showFilters, setShowFilters] = useState(false);

    const stockView = useStockView(campId, true);

    const criticalCount = useMemo(
        () => stockView.filteredRecords.filter((r) => r.stock_status === "CRITICAL").length,
        [stockView.filteredRecords]
    );

    const lowCount = useMemo(
        () => stockView.filteredRecords.filter((r) => r.stock_status === "LOW").length,
        [stockView.filteredRecords]
    );

    const handleClearFilters = () => {
        stockView.setCategoryFilter("");
        stockView.setStatusFilter("");
        stockView.setWarehouseFilter(null);
    };

    return (
        <div className="flex h-full flex-col p-4 md:p-6 bg-bg-app gap-4">
            {/* <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
                    Gestión de Inventario / Ver Stock
                </div>
                <div className="flex items-center gap-3">
                    {criticalCount > 0 && (
                        <div className="flex items-center gap-2">
                            <StockStatusBadge status="CRITICAL" size="sm" />
                            <span className="font-mono text-[10px] text-txt-secondary">
                                {criticalCount} {criticalCount === 1 ? "alerta" : "alertas"}
                            </span>
                        </div>
                    )}
                    {lowCount > 0 && (
                        <div className="flex items-center gap-2">
                            <StockStatusBadge status="LOW" size="sm" />
                            <span className="font-mono text-[10px] text-txt-secondary">
                                {lowCount} {lowCount === 1 ? "recurso" : "recursos"}
                            </span>
                        </div>
                    )}
                </div>
            </div> */}

            {/* {stockView.error && <AlertBanner tone="error" message={stockView.error.message} />} */}

            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-bg-secondary border border-border-default shadow-2xl">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

                <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-bg-primary/30">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-txt-disabled" />
                            <input
                                type="search"
                                placeholder="BUSCAR POR RECURSO, ALMACÉN O CÓDIGO..."
                                className="w-full bg-bg-tertiary border border-border-default pl-9 pr-4 py-2 text-[11px] font-mono text-txt-primary placeholder:text-txt-disabled focus:border-accent outline-none transition-all uppercase tracking-wider"
                                value={stockView.search}
                                onChange={(e) => stockView.setSearch(e.target.value)}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                showFilters
                                    ? "bg-accent border-accent text-white"
                                    : "bg-bg-tertiary border-border-default text-txt-secondary hover:border-accent hover:text-accent"
                            }`}
                        >
                            Filtros
                        </button>
                    </div>

                    <span className="whitespace-nowrap text-[10px] font-mono font-bold text-accent uppercase tracking-widest">
                        Registros: {String(stockView.filteredRecords.length).padStart(4, "0")}
                    </span>
                </div>

                {showFilters && (
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
                )}

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    {stockView.isLoading ? (
                        <div className="flex flex-1 items-center justify-center bg-bg-primary/10">
                            <div className="h-4 w-4 animate-spin border-2 border-accent border-t-transparent rounded-full" />
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
