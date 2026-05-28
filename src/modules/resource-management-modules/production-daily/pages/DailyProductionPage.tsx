import { useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { useMemo } from "react";
import { WarehouseService } from "../../../../services/WarehouseService";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { ProductionExecutionPanel } from "../components/ProductionExecutionPanel";
import { useExecuteDailyProduction } from "../hooks/useExecuteDailyProduction";
import { useToast } from "../../../../shared/hooks/useToast";
import type { ProductionExecutionFormValues, ProductionExecutionResult } from "../schemas/production-execution.schema";

const warehouseService = new WarehouseService();

export function DailyProductionPage() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

    const { execute } = useExecuteDailyProduction();
    const { toast } = useToast();

    // Obtener almacenes del campamento
    const { data: warehousesData } = useQuery({
        queryKey: ["warehouses", campId],
        queryFn: async () => {
            const response = await warehouseService.findAll();
            return response.getResultado<{ id: number; name: string; camp_id: number }[]>("registros") ?? [];
        },
        enabled: campId > 0,
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

    const handleExecute = async (data: ProductionExecutionFormValues): Promise<ProductionExecutionResult> => {
        try {
            const result = await execute.mutateAsync(data);

            if (result.success) {
                toast({
                    tone: "success",
                    title: "Production executed",
                    message: `${result.total_productions} record${result.total_productions !== 1 ? "s" : ""} created successfully.`,
                });
            } else {
                toast({
                    tone: "warning",
                    title: "Execution completed with errors",
                    message: `${result.total_errors} error${result.total_errors !== 1 ? "s" : ""} occurred during production.`,
                });
            }

            return result;
        } catch (error) {
            toast({
                tone: "error",
                title: "Execution failed",
                message: error instanceof Error ? error.message : "Failed to execute daily production.",
            });
            throw error;
        }
    };

    return (
        <div className="flex flex-1 min-h-0 flex-col p-4 md:p-6 bg-bg-app gap-4">
            {/* <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
                    Producción Diaria / Ejecutar Producción
                </div>
                <Play className="h-5 w-5 text-accent" />
            </div> */}

            <div className="relative flex min-h-0 flex-1 overflow-hidden bg-bg-secondary border border-border-default">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div className="flex-1 overflow-auto p-6">
                        <div className="max-w-3xl mx-auto">
                            <div className="mb-6 p-4 bg-status-info/10 border border-status-info/30">
                                <div className="font-mono text-[10px] font-bold text-status-info mb-2 uppercase tracking-widest">
                                    Automated Production Process
                                </div>
                                <div className="font-mono text-[9px] text-txt-secondary leading-relaxed space-y-2">
                                    <p>This process automatically executes daily production by following these steps:</p>
                                    <ol className="list-decimal list-inside space-y-1 ml-2">
                                        <li>Identifies all active camp members with assigned professions</li>
                                        <li>Finds active production rules for each profession</li>
                                        <li>Generates production records with expected quantities</li>
                                        <li>Automatically updates warehouse inventory</li>
                                        <li>Checks and generates alerts if stock falls below the minimum level</li>
                                    </ol>
                                    <p className="text-status-warning font-bold mt-2">
                                        ⚠ This process should only be executed once per day
                                    </p>
                                </div>
                            </div>

                            <ProductionExecutionPanel
                                warehouseOptions={warehouseOptions}
                                onExecute={handleExecute}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
