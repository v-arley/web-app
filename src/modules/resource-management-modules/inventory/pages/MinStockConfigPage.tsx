import { useQuery } from "@tanstack/react-query";
import { Settings2 } from "lucide-react";
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
        setSelectedWarehouseId(warehouseId);
        setSelectedResourceId(resourceId);
        setInitialData({ warehouse_id: warehouseId, resource_id: resourceId });
        setIsFormOpen(true);
    };

    const handleClear = () => {
        setInitialData(undefined);
        setSelectedWarehouseId(null);
        setSelectedResourceId(null);
    };

    return (
        <article className="flex flex-1 min-h-0 flex-col rmm-content-pad bg-transparent gap-4">
            <div className="relative flex min-h-0 flex-1 overflow-hidden bg-black/50 backdrop-blur-lg border border-border-default">
                {/* <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" /> */}
                <div className="flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden">
                    {/* Stock table — click to pre-fill the config form */}
                    <div className="flex-1 flex flex-col overflow-hidden border-r border-border-default">

                        <header className="rmm-panel-header border-b border-border-default bg-bg-secondary/30 shrink-0">
                            <Settings2 className="h-4 w-4 text-accent shrink-0" />
                            <div className="rmm-panel-title flex-1 min-w-0">
                                <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide">
                                    Current Stock
                                </div>
                                <p className="font-mono text-[11px] text-txt-muted uppercase tracking-widest mt-0.5">
                                    Select a row to configure its minimum stock level
                                </p>
                            </div>
                            <div className="relative min-w-0 w-full sm:w-40">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    placeholder="Search resource..."
                                    className="rmm-input pl-6 py-1 text-[11px]"
                                />
                            </div>
                        </header>

                        <div className="flex-1 overflow-auto">
                            {stockQuery.isLoading ? (
                                <div className="flex items-center justify-center h-full text-txt-disabled font-mono text-xs">
                                    Loading stock...
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
            </div>
        </article>
    );
}
