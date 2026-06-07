import { useNavigation } from "../../../../shared/app/NavigationContext";
import PaginationFooter from "../../shared/components/PaginationFooter";
import { StockFiltersPanel } from "../components/StockFiltersPanel";
import { StockTable } from "../components/StockTable";
import { useStockView } from "../hooks/useStockView";

export function StockViewPage() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

    const stockView = useStockView(campId, true);

    const handleClearFilters = () => {
        stockView.setCategoryFilter("");
        stockView.setStatusFilter("");
        stockView.setWarehouseFilter(null);
        stockView.setPage(1);
    };

    return (
        <article className="rmm-scope flex flex-col h-full bg-transparent overflow-hidden rmm-content-pad">
            <div className="flex-1 overflow-hidden bg-black/50 backdrop-blur-lg">
                <section className="h-full flex flex-col bg-transparent border border-border-default overflow-hidden">
                    <header className="rmm-panel-header border-b border-border-default bg-bg-secondary/30 shrink-0">
                        <div className="rmm-panel-title font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide flex items-center gap-2">
                            <div className="w-1 h-3 bg-accent" />
                            Real-time Inventory
                        </div>

                        <div className="rmm-panel-actions">
                            <div className="relative min-w-0 w-full sm:w-48">
                                <input
                                    type="search"
                                    placeholder="SCAN_RESOURCE_ID..."
                                    className="input-default-style h-8 pl-9"
                                    value={stockView.search}
                                    onChange={(e) => {
                                        stockView.setSearch(e.target.value);
                                        stockView.setPage(1);
                                    }}
                                />
                            </div>

                            <StockFiltersPanel
                                categories={stockView.categories}
                                warehouses={stockView.warehouses}
                                selectedCategory={stockView.categoryFilter}
                                selectedStatus={stockView.statusFilter}
                                selectedWarehouse={stockView.warehouseFilter}
                                onCategoryChange={(value) => {
                                    stockView.setCategoryFilter(value);
                                    stockView.setPage(1);
                                }}
                                onStatusChange={(value) => {
                                    stockView.setStatusFilter(value);
                                    stockView.setPage(1);
                                }}
                                onWarehouseChange={(value) => {
                                    stockView.setWarehouseFilter(value);
                                    stockView.setPage(1);
                                }}
                                onClear={handleClearFilters}
                            />
                        </div>
                    </header>

                    <div className="flex-1 overflow-auto table-system-wrap h-full">
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

                    <PaginationFooter
                        page={stockView.page}
                        setPage={stockView.setPage}
                        totalPages={stockView.totalPages}
                        totalRecords={stockView.totalRecords}
                    />
                </section>
            </div>
        </article>
    );
}
