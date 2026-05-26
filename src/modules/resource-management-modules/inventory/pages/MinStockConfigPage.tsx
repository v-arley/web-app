import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Settings2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ResourceService } from "../../../../services/ResourceService";
import { WarehouseService } from "../../../../services/WarehouseService";
import { getAuthContextFromToken } from "../../../../shared/utils/authAccess";
import { MinStockConfigForm } from "../components/MinStockConfigForm";
import { useMinStockMutation } from "../hooks/useMinStockMutation";
import type { MinStockConfigFormValues } from "../schemas/min-stock-config.schema";

const resourceService = new ResourceService();
const warehouseService = new WarehouseService();

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

function MinStockConfigPageContent() {
    const authContext = getAuthContextFromToken();
    const campId = authContext.campId ?? 0;

    const [feedback, setFeedback] = useState<{ tone: "error" | "success" | "info"; message: string } | null>(null);
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
            setFeedback({ tone: "success", message: "Configuración guardada correctamente." });
            setInitialData(undefined);
        } catch (error) {
            setFeedback({
                tone: "error",
                message: error instanceof Error ? error.message : "No se pudo guardar la configuración.",
            });
        }
    };

    const handleClear = () => {
        setInitialData(undefined);
        setFeedback(null);
    };

    return (
        <div className="flex flex-1 min-h-0 flex-col p-4 md:p-6 bg-bg-app gap-4">
            {/* <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
                    Gestión de Inventario / Configurar Mínimos de Stock
                </div>
                <Settings2 className="h-5 w-5 text-accent" />
            </div> */}

            {feedback && <AlertBanner tone={feedback.tone} message={feedback.message} />}

            <div className="relative flex min-h-0 flex-1 overflow-hidden bg-bg-secondary border border-border-default">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

                <div className="flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden">
                    <div className="flex-1 flex items-center justify-center bg-bg-primary/10 border-r border-border-default">
                        <div className="text-center px-8 py-12 max-w-md">
                            <Settings2 className="h-16 w-16 text-accent/30 mx-auto mb-4" />
                            <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em] mb-4">
                                Stock de Seguridad
                            </div>
                            <div className="space-y-4 text-left">
                                <div className="p-4 bg-status-info/10 border border-status-info/30">
                                    <div className="font-mono text-[10px] font-bold text-status-info mb-2">
                                        ¿Qué es el Stock Mínimo?
                                    </div>
                                    <div className="font-mono text-[9px] text-txt-secondary leading-relaxed">
                                        Es la cantidad mínima que debe existir de un recurso en un almacén. Cuando el
                                        stock actual cae por debajo de este valor, se genera automáticamente una alerta.
                                    </div>
                                </div>
                                <div className="p-4 bg-status-warning/10 border border-status-warning/30">
                                    <div className="font-mono text-[10px] font-bold text-status-warning mb-2">
                                        Validaciones
                                    </div>
                                    <div className="font-mono text-[9px] text-txt-secondary leading-relaxed">
                                        • La cantidad mínima debe ser mayor o igual a 0<br />
                                        • Se aplica por recurso y por almacén<br />
                                        • Las alertas se generan automáticamente por el sistema
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

export function MinStockConfigPage() {
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
            <MinStockConfigPageContent />
        </QueryClientProvider>
    );
}
