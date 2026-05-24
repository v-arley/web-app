import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Settings2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ResourceService } from "../../../../services/ResourceService";
import { getAuthContextFromToken } from "../../../../utils/authAccess";
import { ProductionRuleForm } from "../components/ProductionRuleForm";
import { ProductionRulesTable } from "../components/ProductionRulesTable";
import { useProductionRuleMutation } from "../hooks/useProductionRuleMutation";
import { useProductionRulesQuery } from "../hooks/useProductionRulesQuery";
import type { ProductionRuleFormValues } from "../schemas/production-rule.schema";
// import { useToast } from "../../../../hooks/useToast";

const queryClient = new QueryClient();
const resourceService = new ResourceService();

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

function ProductionRulesPageContent() {
    const authContext = getAuthContextFromToken();
    const campId = authContext.campId ?? 0;

    const [feedback, setFeedback] = useState<{ tone: "error" | "success" | "info"; message: string } | null>(null);
    const [selectedRule, setSelectedRule] = useState<ProductionRuleFormValues | undefined>(undefined);

    const { data: rules = [], isLoading } = useProductionRulesQuery(campId);
    const ruleMutation = useProductionRuleMutation();
    // const { toast } = useToast();

    // Obtener recursos globales
    const { data: resourcesData } = useQuery({
        queryKey: ["resources"],
        queryFn: async () => {
            const response = await resourceService.findAll();
            return response.getResultado<{ id: number; code: string; name: string }[]>("registros") ?? [];
        },
    });

    // Obtener profesiones (simulado, debería venir del backend)
    const professionOptions = [
        { id: 1, label: "Médico" },
        { id: 2, label: "Ingeniero" },
        { id: 3, label: "Soldado" },
        { id: 4, label: "Técnico en Comunicaciones" },
        { id: 5, label: "Logística" },
        { id: 6, label: "Carpintero" },
        { id: 7, label: "Electricista" },
        { id: 8, label: "Cocinero" },
        { id: 9, label: "Mecánico" },
        { id: 10, label: "Explorador" },
    ];

    const resourceOptions = useMemo(() => {
        if (!resourcesData) return [];
        return resourcesData.map((r) => ({
            id: r.id,
            label: `${r.code} - ${r.name}`,
        }));
    }, [resourcesData]);

    const professionMap = useMemo(() => {
        return new Map(professionOptions.map((p) => [p.id, p.label]));
    }, [professionOptions]);

    const resourceMap = useMemo(() => {
        if (!resourcesData) return new Map();
        return new Map(resourcesData.map((r) => [r.id, `${r.code} - ${r.name}`]));
    }, [resourcesData]);

    const handleSubmit = async (values: ProductionRuleFormValues) => {
        try {
            if (selectedRule?.id) {
                await ruleMutation.update.mutateAsync({ id: selectedRule.id, data: { ...values, camp_id: campId } });
                //toast({ message: "Regla actualizada correctamente", tone: "success" });
            } else {
                await ruleMutation.create.mutateAsync({ ...values, camp_id: campId });
                //toast({ message: "Regla creada correctamente", tone: "success" });
            }
            setSelectedRule(undefined);
            setFeedback(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : "No se pudo guardar la regla.";
            setFeedback({ tone: "error", message });
        }
    };

    const handleEdit = (rule: ProductionRuleFormValues) => {
        setSelectedRule(rule);
        setFeedback(null);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Está seguro de eliminar esta regla de producción?")) return;

        try {
            await ruleMutation.remove.mutateAsync(id);
            //toast({ message: "Regla eliminada correctamente", tone: "success" });
            setFeedback(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : "No se pudo eliminar la regla.";
            setFeedback({ tone: "error", message });
        }
    };

    const handleClear = () => {
        setSelectedRule(undefined);
        setFeedback(null);
    };

    return (
        <div className="flex h-full flex-col p-4 md:p-6 bg-bg-app gap-4">
            {/* <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
                    Producción Diaria / Configurar Reglas
                </div>
                <Settings2 className="h-5 w-5 text-accent" />
            </div> */}

            {feedback && <AlertBanner tone={feedback.tone} message={feedback.message} />}

            <div className="relative flex min-h-0 flex-1 overflow-hidden bg-bg-secondary border border-border-default shadow-2xl">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

                <div className="flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden">
                    <div className="flex-1 overflow-auto bg-bg-primary/10">
                        <div className="p-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-64 text-txt-disabled font-mono text-xs">
                                    Cargando reglas de producción...
                                </div>
                            ) : (
                                <ProductionRulesTable
                                    rules={rules}
                                    professionMap={professionMap}
                                    resourceMap={resourceMap}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )}
                        </div>
                    </div>

                    <aside className="flex w-full flex-col lg:w-md shrink-0 bg-bg-primary/20 overflow-hidden">
                        <ProductionRuleForm
                            key={selectedRule?.id ?? 'new'}
                            professionOptions={professionOptions}
                            resourceOptions={resourceOptions}
                            initialData={selectedRule}
                            isSubmitting={ruleMutation.create.isPending || ruleMutation.update.isPending}
                            onSubmit={handleSubmit}
                            onClear={handleClear}
                        />
                    </aside>
                </div>
            </div>
        </div>
    );
}

export function ProductionRulesPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <ProductionRulesPageContent />
        </QueryClientProvider>
    );
}
