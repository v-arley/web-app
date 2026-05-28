import { useQuery } from "@tanstack/react-query";
import { Settings2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ResourceService } from "../../../../services/ResourceService";
import { WarehouseService } from "../../../../services/WarehouseService";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { useToast } from "../../../../shared/hooks/useToast";
import { MinStockConfigForm } from "../components/MinStockConfigForm";
import { useMinStockMutation } from "../hooks/useMinStockMutation";
import type { MinStockConfigFormValues } from "../schemas/min-stock-config.schema";

const resourceService = new ResourceService();
const warehouseService = new WarehouseService();

export function MinStockConfigPage() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

    const { toast } = useToast();
    const [initialData, setInitialData] = useState<Partial<MinStockConfigFormValues> | undefined>(undefined);

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

    const handleClear = () => {
        setInitialData(undefined);
    };

    return (
        <div className="flex flex-1 min-h-0 flex-col p-4 md:p-6 bg-bg-app gap-4">
            {/* <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
                    Gestión de Inventario / Configurar Mínimos de Stock
                </div>
                <Settings2 className="h-5 w-5 text-accent" />
            </div> */}

            <div className="relative flex min-h-0 flex-1 overflow-hidden bg-bg-secondary border border-border-default">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

                <div className="flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden">
                    <div className="flex-1 flex items-center justify-center bg-bg-primary/10 border-r border-border-default">
                        <div className="text-center px-8 py-12 max-w-md">
                            <Settings2 className="h-16 w-16 text-accent/30 mx-auto mb-4" />
                            <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em] mb-4">
                                Safety Stock
                            </div>
                            <div className="space-y-4 text-left">
                                <div className="p-4 bg-status-info/10 border border-status-info/30">
                                    <div className="font-mono text-[10px] font-bold text-status-info mb-2">
                                        ¿What is Minimum Stock?
                                    </div>
                                    <div className="font-mono text-[9px] text-txt-secondary leading-relaxed">
                                        This is the minimum quantity of a resource that must be kept in a warehouse. When the current stock falls below this value, an alert is automatically generated.
                                    </div>
                                </div>
                                <div className="p-4 bg-status-warning/10 border border-status-warning/30">
                                    <div className="font-mono text-[10px] font-bold text-status-warning mb-2">
                                        Validations
                                    </div>
                                    <div className="font-mono text-[9px] text-txt-secondary leading-relaxed">
                                        • The minimum quantity must be greater than or equal to 0<br />
                                        • It applies per resource and per warehouse<br />
                                        • Alerts are generated automatically by the system
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="flex w-full flex-col lg:w-[380px] shrink-0 bg-bg-primary/20 border-l border-border-default relative overflow-hidden">
                        <MinStockConfigForm
                            key={JSON.stringify(initialData)}
                            warehouseOptions={warehouseOptions}
                            resourceOptions={resourceOptions}
                            initialData={initialData}
                            isSubmitting={minStockMutation.update.isPending}
                            onSubmit={handleSubmit}
                            onClear={handleClear}
                        />
                    </aside>
                </div>
            </div>
        </div>
    );
}
