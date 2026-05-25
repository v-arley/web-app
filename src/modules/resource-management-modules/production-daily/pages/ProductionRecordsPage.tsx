import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ResourceService } from "../../../../services/ResourceService";
import { WarehouseService } from "../../../../services/WarehouseService";
import { getAuthContextFromToken } from "../../../../utils/authAccess";
import { ProductionAdjustmentForm } from "../components/ProductionAdjustmentForm";
import { ProductionRecordsTable } from "../components/ProductionRecordsTable";
import { useProductionRecordMutation } from "../hooks/useProductionRecordMutation";
import { useProductionRecordsQuery } from "../hooks/useProductionRecordsQuery";
import type { ProductionRecordFormValues } from "../schemas/production-record.schema";
// import { useToast } from "../../../../hooks/useToast";
import { useDebounce } from "../../../../hooks/useDebounce";

const queryClient = new QueryClient();
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

function ProductionRecordsPageContent() {
    const authContext = getAuthContextFromToken();
    const campId = authContext.campId ?? 0;

    const [personId, setPersonId] = useState<number | undefined>(undefined);
    const [resourceId, setResourceId] = useState<number | undefined>(undefined);
    const [feedback, setFeedback] = useState<{ tone: "error" | "success" | "info"; message: string } | null>(null);

    // Debounce filters
    const debouncedPersonId = useDebounce(personId, 500);
    const debouncedResourceId = useDebounce(resourceId, 500);

    const filters = useMemo(() => ({
        personId: debouncedPersonId,
        resourceId: debouncedResourceId,
    }), [debouncedPersonId, debouncedResourceId]);

    const { data: records = [], isLoading } = useProductionRecordsQuery(campId, filters);
    const recordMutation = useProductionRecordMutation();
    //const { toast } = useToast();
    //const { showToast } = useToast();

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

    // Obtener personas (simulado, debería venir del backend)
    const personOptions = [
        { id: 6, label: "Carmen Vega - Médica" },
        { id: 7, label: "Roberto Chinchilla - Ingeniero" },
        { id: 11, label: "Miguel Araya - Carpintero" },
        { id: 13, label: "Fernando Quesada - Electricista" },
        { id: 14, label: "Gabriela Picado - Cocinera" },
    ];

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

    const personMap = useMemo(() => {
        return new Map(personOptions.map((p) => [p.id, p.label]));
    }, []);

    const warehouseMap = useMemo(() => {
        if (!warehousesData) return new Map();
        return new Map(warehousesData.map((w) => [w.id, w.name]));
    }, [warehousesData]);

    const resourceMap = useMemo(() => {
        if (!resourcesData) return new Map();
        return new Map(resourcesData.map((r) => [r.id, `${r.code} - ${r.name}`]));
    }, [resourcesData]);

    const handleSubmit = async (values: ProductionRecordFormValues) => {
        try {
            await recordMutation.create.mutateAsync(values);
            //toast({ message: "Ajuste manual registrado correctamente", tone: "success" });
            setFeedback(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : "No se pudo registrar el ajuste.";
            setFeedback({ tone: "error", message });
        }
    };

    return (
        <div className="rmm-scope flex h-full flex-col p-4 md:p-6 bg-bg-app gap-4">
            {/* <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
                    Producción Diaria / Registros y Ajustes
                </div>
                <FileText className="h-5 w-5 text-accent" />
            </div> */}

            {feedback && <AlertBanner tone={feedback.tone} message={feedback.message} />}

            <div className="relative flex min-h-0 flex-1 overflow-hidden bg-bg-secondary border border-border-default">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

                <div className="flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden">
                    <div className="flex-1 overflow-auto bg-bg-primary/10">
                        <div className="p-6">
                            <div className="mb-6 bg-bg-secondary border border-border-default">
                                <div className="px-5 py-4 border-b border-border-default bg-bg-secondary/50">
                                    <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em]">
                                        <Search className="w-4 h-4" />
                                        Filtros de Búsqueda
                                    </div>
                                </div>
                                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-txt-disabled">
                                            Trabajador
                                        </span>
                                        <select
                                            value={personId ?? 0}
                                            onChange={(e) => setPersonId(Number(e.target.value) || undefined)}
                                            className="bg-bg-tertiary border border-border-default px-3 py-2 font-mono text-xs text-txt-primary focus:border-accent outline-none transition-all"
                                        >
                                            <option value={0}>Todos</option>
                                            {personOptions.map((p) => (
                                                <option key={p.id} value={p.id}>{p.label}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-txt-disabled">
                                            Recurso
                                        </span>
                                        <select
                                            value={resourceId ?? 0}
                                            onChange={(e) => setResourceId(Number(e.target.value) || undefined)}
                                            className="bg-bg-tertiary border border-border-default px-3 py-2 font-mono text-xs text-txt-primary focus:border-accent outline-none transition-all"
                                        >
                                            <option value={0}>Todos</option>
                                            {resourceOptions.map((r) => (
                                                <option key={r.id} value={r.id}>{r.label}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex items-center justify-center h-64 text-txt-disabled font-mono text-xs">
                                    Cargando registros de producción...
                                </div>
                            ) : (
                                <ProductionRecordsTable
                                    records={records}
                                    personMap={personMap}
                                    warehouseMap={warehouseMap}
                                    resourceMap={resourceMap}
                                />
                            )}
                        </div>
                    </div>

                    <aside className="flex w-full flex-col lg:w-md shrink-0 bg-bg-primary/20 overflow-auto p-6">
                        <ProductionAdjustmentForm
                            personOptions={personOptions}
                            warehouseOptions={warehouseOptions}
                            resourceOptions={resourceOptions}
                            isSubmitting={recordMutation.create.isPending}
                            onSubmit={handleSubmit}
                        />
                    </aside>
                </div>
            </div>
        </div>
    );
}

export function ProductionRecordsPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <ProductionRecordsPageContent />
        </QueryClientProvider>
    );
}
