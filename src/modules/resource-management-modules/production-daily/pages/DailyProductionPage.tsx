import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { useMemo } from "react";
import { WarehouseService } from "../../../../services/WarehouseService";
import { getAuthContextFromToken } from "../../../../shared/utils/authAccess";
import { ProductionExecutionPanel } from "../components/ProductionExecutionPanel";
import { useExecuteDailyProduction } from "../hooks/useExecuteDailyProduction";
//import { useToast } from "../../../../hooks/useToast";
import type { ProductionExecutionFormValues, ProductionExecutionResult } from "../schemas/production-execution.schema";

const queryClient = new QueryClient();
const warehouseService = new WarehouseService();

function DailyProductionPageContent() {
    const authContext = getAuthContextFromToken();
    const campId = authContext.campId ?? 0;

    const { execute } = useExecuteDailyProduction();
    //const { toast } = useToast();

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
                //toast({ message: `Producción ejecutada: ${result.total_productions} registros creados`, tone: "success" });
            } else {
                //toast({ message: `Ejecución completada con ${result.total_errors} errores`, tone: "warning" });
            }
            
            return result;
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al ejecutar la producción";
            //toast({ message, tone: "error" });
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
                                    Proceso Automático de Producción
                                </div>
                                <div className="font-mono text-[9px] text-txt-secondary leading-relaxed space-y-2">
                                    <p>Este proceso ejecuta automáticamente la producción diaria siguiendo estos pasos:</p>
                                    <ol className="list-decimal list-inside space-y-1 ml-2">
                                        <li>Identifica todas las personas activas del campamento con profesiones asignadas</li>
                                        <li>Busca las reglas de producción activas para cada profesión</li>
                                        <li>Genera registros de producción con las cantidades esperadas</li>
                                        <li>Actualiza automáticamente el inventario de las bodegas</li>
                                        <li>Verifica y genera alertas si hay stock bajo el mínimo</li>
                                    </ol>
                                    <p className="text-status-warning font-bold mt-2">
                                        ⚠ Este proceso solo debe ejecutarse una vez por día
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

export function DailyProductionPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <DailyProductionPageContent />
        </QueryClientProvider>
    );
}
