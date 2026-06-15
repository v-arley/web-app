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
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
            <section className="app-split app-split--glass" style={{ flexDirection: "column" }}>
                <header className="app-panel-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {/* <div style={{ width: "0.25rem", height: "0.875rem", background: "var(--color-accent)", flexShrink: 0 }} /> */}
                        <span className="app-panel-title">Real-time Inventory</span>
                    </div>

                    <div className="app-panel-actions">
                        <div style={{ position: "relative", minWidth: 0, width: "12rem" }}>
                            <input
                                type="search"
                                placeholder="SCAN_RESOURCE_ID..."
                                className="app-input-default"
                                value={stockView.search}
                                onChange={(e) => {
                                    stockView.setSearch(e.target.value);
                                    stockView.setPage(1);
                                }}
                            />
                        </div>
                        
                        {/* TODO: Eliminar todos los filtro y conservar el filtro por estado: ok, low... */}
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

                <div className="app-table-region app-table-frame">
                    {stockView.isLoading ? (
                        <div className="app-loading-state" style={{ flexDirection: "column", gap: "0.5rem" }}>
                            <div className="app-spinner app-spinner--lg" />
                            <span className="app-eyebrow" style={{ letterSpacing: "0.35em" }}>Decrypting Ledger...</span>
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
    );
}
