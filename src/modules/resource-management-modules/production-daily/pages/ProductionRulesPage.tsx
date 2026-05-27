import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Settings2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ProfessionService } from "../../../../services/ProfessionService";
import { ResourceService } from "../../../../services/ResourceService";
import { getAuthContextFromToken } from "../../../../shared/utils/authAccess";
import { ProductionRuleForm } from "../components/ProductionRuleForm";
import { ProductionRulesTable } from "../components/ProductionRulesTable";
import { useProductionRuleMutation } from "../hooks/useProductionRuleMutation";
import { useProductionRulesQuery } from "../hooks/useProductionRulesQuery";
import type { ProductionRuleFormValues } from "../schemas/production-rule.schema";
import { useToast } from "../../../../shared/hooks/useToast";

const queryClient = new QueryClient();
const professionService = new ProfessionService();
const resourceService = new ResourceService();

function ProductionRulesPageContent() {
    const authContext = getAuthContextFromToken();
    const campId = authContext.campId ?? 0;

    const [selectedRule, setSelectedRule] = useState<ProductionRuleFormValues | undefined>(undefined);

    const { data: rules = [], isLoading } = useProductionRulesQuery(campId);
    const ruleMutation = useProductionRuleMutation();
    const { toast } = useToast();

    // Obtener recursos globales
    const { data: resourcesData } = useQuery({
        queryKey: ["resources"],
        queryFn: async () => {
            const response = await resourceService.findAll();
            return response.getResultado<{ id: number; code: string; name: string }[]>("registros") ?? [];
        },
    });

    // Obtener profesiones desde el backend
    const { data: professionsData } = useQuery({
        queryKey: ["professions"],
        queryFn: async () => {
            const response = await professionService.findAll();
            return response.getResultado<{ id: number; name: string }[]>("registros") ?? [];
        },
    });

    const professionOptions = useMemo(() => {
        if (!professionsData) return [];
        return professionsData.map((p) => ({ id: p.id!, label: p.name }));
    }, [professionsData]);

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
            if (selectedRule) {
                await ruleMutation.update.mutateAsync({ currentRule: selectedRule, data: { ...values, camp_id: campId } });
                toast({ tone: "success", title: "Rule updated", message: "Production rule saved successfully." });
            } else {
                await ruleMutation.create.mutateAsync({ ...values, camp_id: campId });
                toast({ tone: "success", title: "Rule created", message: "New production rule added successfully." });
            }
            setSelectedRule(undefined);
        } catch (error) {
            toast({
                tone: "error",
                title: "Save failed",
                message: error instanceof Error ? error.message : "Failed to save the production rule.",
            });
        }
    };

    const handleEdit = (rule: ProductionRuleFormValues) => {
        setSelectedRule(rule);
    };

    const handleDelete = async (rule: ProductionRuleFormValues) => {
        if (!confirm("Are you sure you want to delete this production rule?")) return;

        try {
            await ruleMutation.remove.mutateAsync(rule);
            toast({ tone: "success", title: "Rule deleted", message: "Production rule removed successfully." });
        } catch (error) {
            toast({
                tone: "error",
                title: "Delete failed",
                message: error instanceof Error ? error.message : "Failed to delete the production rule.",
            });
        }
    };

    const handleClear = () => {
        setSelectedRule(undefined);
    };

    return (
        <div className="flex flex-1 min-h-0 flex-col p-4 md:p-6 bg-bg-app gap-4">
            <div className="relative flex min-h-0 flex-1 overflow-hidden bg-bg-secondary border border-border-default">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

                <div className="flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden">
                    <div className="flex-1 overflow-auto bg-bg-primary/10">
                        <div className="p-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-64 text-txt-disabled font-mono text-xs">
                                    Loading production rules...
                                </div>
                            ) : (
                                <ProductionRulesTable
                                    rules={rules}
                                    professionMap={professionMap}
                                    resourceMap={resourceMap}
                                    selectedKey={selectedRule ? `${selectedRule.camp_id}-${selectedRule.profession_id}-${selectedRule.resource_id}-${selectedRule.effective_date}` : undefined}
                                    onSelect={handleEdit}
                                />
                            )}
                        </div>
                    </div>

                    <aside className="flex w-full flex-col lg:w-[400px] shrink-0 bg-bg-primary/20 border-l border-border-default relative overflow-hidden">
                        <ProductionRuleForm
                            key={selectedRule ? `${selectedRule.camp_id}-${selectedRule.profession_id}-${selectedRule.resource_id}-${selectedRule.effective_date}` : 'new'}
                            professionOptions={professionOptions}
                            resourceOptions={resourceOptions}
                            initialData={selectedRule}
                            isSubmitting={ruleMutation.create.isPending || ruleMutation.update.isPending}
                            onSubmit={handleSubmit}
                            onClear={handleClear}
                            onDelete={handleDelete}
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
