import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ResourceService } from "../../../../services/ResourceService";
import { WarehouseService } from "../../../../services/WarehouseService";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { useToast } from "../../../../shared/hooks/useToast";
import PaginationFooter from "../../shared/components/PaginationFooter";
import { MinStockConfigForm } from "../components/MinStockConfigForm";
import { StockTable } from "../components/StockTable";
import { useMinStockMutation } from "../hooks/useMinStockMutation";
import { useStockSummaryQuery } from "../hooks/useStockSummaryQuery";
import type { MinStockConfigFormValues } from "../schemas/min-stock-config.schema";
import CollapsibleSidePanel, { CollapsiblePanelHeader, getInitialSidePanelOpenState } from "../../shared/components/CollapsibleSidePanel";

const resourceService = new ResourceService();
const warehouseService = new WarehouseService();

export function MinStockConfigPage() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

    const { toast } = useToast();
    const [initialData, setInitialData] = useState<Partial<MinStockConfigFormValues> | undefined>(undefined);
    const [isFormOpen, setIsFormOpen] = useState(getInitialSidePanelOpenState);

    const minStockMutation = useMinStockMutation();

    // Obtener almacenes del campamento
    const { data: warehousesData } = useQuery({
        queryKey: ["warehouses", campId],
        queryFn: async () => {
            const response = await warehouseService.findAll();
            return response.getResultado<{ id: number; name: string; camp_id: number }[]>("registros") ?? [];
        },
        enabled: campId > 0,
    });

    // Obtener recursos globales
    const { data: resourcesData } = useQuery({
        queryKey: ["resources"],
        queryFn: async () => {
            const response = await resourceService.findAll();
            return response.getResultado<{ id: number; code: string; name: string }[]>("registros") ?? [];
        },
    });

    const warehouseOptions = useMemo(() => {
        if (!warehousesData) return [];
        return warehousesData
            .filter((w) => w.camp_id === campId)
            .map((w) => ({
                id: w.id,
                label: w.name,
            }));
    }, [warehousesData, campId]);

    const resourceOptions = useMemo(() => {
        if (!resourcesData) return [];
        return resourcesData.map((r) => ({
            id: r.id,
            label: `${r.code} - ${r.name}`,
        }));
    }, [resourcesData]);

    const handleSubmit = async (values: MinStockConfigFormValues) => {
        try {
            await minStockMutation.update.mutateAsync(values);
            toast({
                tone: "success",
                title: "Settings saved",
                message: "Minimum stock levels have been updated.",
            });
            setInitialData(undefined);
        } catch (error) {
            toast({
                tone: "error",
                title: "Save failed",
                message: error instanceof Error ? error.message : "Could not save the configuration.",
            });
        }
    };

    const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
    const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 50;

    const { query: stockQuery } = useStockSummaryQuery(campId, {
        search: search.trim() || undefined,
        page,
        limit: pageSize,
    });
    const stockRecords = stockQuery.data?.items ?? [];
    const pagination = stockQuery.data?.pagination ?? { page, limit: pageSize, total: 0, totalPages: 1 };

    const handleStockSelect = (warehouseId: number, resourceId: number) => {
        const selectedStock = stockRecords.find(
            (record) => record.warehouse_id === warehouseId && record.resource_id === resourceId,
        );
        setSelectedWarehouseId(warehouseId);
        setSelectedResourceId(resourceId);
        setInitialData({
            warehouse_id: warehouseId,
            resource_id: resourceId,
            min_quantity: selectedStock?.min_quantity ?? 0,
        });
        setIsFormOpen(true);
    };

    const handleClear = () => {
        setInitialData(undefined);
        setSelectedWarehouseId(null);
        setSelectedResourceId(null);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
            <section className="app-split app-split--glass">
                <div className="app-split__inner">
                    {/* Stock table — click to pre-fill the config form */}
                    <div className="app-split__main">

                        <header className="app-panel-header">
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <div>
                                    <div className="app-panel-title">Current Stock</div>
                                    <div className="app-panel-subtitle">Select a row to configure its minimum stock level</div>
                                </div>
                            </div>
                            <div className="app-panel-actions">
                                <div style={{ position: "relative", minWidth: 0, width: "12rem" }}>
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                        placeholder="Search resource..."
                                        className="app-input-default"
                                    />
                                </div>
                            </div>
                        </header>

                        <div className="app-table-region app-table-frame">
                            {stockQuery.isLoading ? (
                                <div className="app-loading-state" style={{ flexDirection: "column", gap: "0.5rem" }}>
                                    <div className="app-spinner app-spinner--lg" />
                                    <span className="app-eyebrow" style={{ letterSpacing: "0.35em" }}>Loading Stock...</span>
                                </div>
                            ) : (
                                <StockTable
                                    stocks={stockRecords}
                                    selectedWarehouseId={selectedWarehouseId}
                                    selectedResourceId={selectedResourceId}
                                    onSelect={handleStockSelect}
                                />
                            )}
                        </div>
                        {/* Pagination footer */}
                        <PaginationFooter
                            page={pagination.page}
                            setPage={setPage}
                            totalPages={pagination.totalPages}
                            totalRecords={pagination.total}
                        />
                    </div>
                    <CollapsibleSidePanel
                        isOpen={isFormOpen}
                        label="Minimum stock form"
                        widthClassName="lg:w-95"
                        onOpen={() => setIsFormOpen(true)}
                        onClose={() => setIsFormOpen(false)}
                    >
                        <CollapsiblePanelHeader
                            title="Minimum Stock"
                            subtitle="Configure alert thresholds"
                            onClose={() => setIsFormOpen(false)}
                        />
                        <MinStockConfigForm
                            key={JSON.stringify(initialData)}
                            warehouseOptions={warehouseOptions}
                            resourceOptions={resourceOptions}
                            initialData={initialData}
                            isSubmitting={minStockMutation.update.isPending}
                            onSubmit={handleSubmit}
                            onClear={handleClear}
                        />
                    </CollapsibleSidePanel>
                </div>
            </section>
        </div>
    );
}
