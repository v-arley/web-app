import { useQuery } from "@tanstack/react-query";
import { Play, Settings2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProfessionService } from "../../../../services/ProfessionService";
import { ResourceService } from "../../../../services/ResourceService";
import { WarehouseService } from "../../../../services/WarehouseService";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import PaginationFooter from "../../shared/components/PaginationFooter";
import CollapsibleSidePanel, { CollapsiblePanelHeader, getInitialSidePanelOpenState } from "../../shared/components/CollapsibleSidePanel";
import { ProductionExecutionPanel } from "../components/ProductionExecutionPanel";
import { ProductionRuleForm } from "../components/ProductionRuleForm";
import { ProductionRulesTable } from "../components/ProductionRulesTable";
import { useExecuteDailyProduction } from "../hooks/useExecuteDailyProduction";
import { useProductionRuleMutation } from "../hooks/useProductionRuleMutation";
import { useProductionRulesQuery } from "../hooks/useProductionRulesQuery";
import type { ProductionRuleFormValues } from "../schemas/production-rule.schema";
import { useToast } from "../../../../shared/hooks/useToast";

const professionService = new ProfessionService();
const resourceService = new ResourceService();
const warehouseService = new WarehouseService();

export function ProductionRulesPage() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

    const [selectedRule, setSelectedRule] = useState<ProductionRuleFormValues | undefined>(undefined);
    const [showExecutePanel, setShowExecutePanel] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(getInitialSidePanelOpenState);
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const { data: rulesResult, isLoading } = useProductionRulesQuery(campId, true, { page, limit: pageSize });
    const rules = rulesResult?.items ?? [];
    const pagination = rulesResult?.pagination ?? { page, limit: pageSize, total: 0, totalPages: 1 };
    const ruleMutation = useProductionRuleMutation();
    const { execute: executeProduction } = useExecuteDailyProduction();
    const { toast } = useToast();

    // Almacenes del campamento
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

    // Obtener profesiones desde el backend
    const { data: professionsData } = useQuery({
        queryKey: ["professions"],
        queryFn: async () => {
            const response = await professionService.findAll();
            return response.getResultado<{ id: number; name: string }[]>("registros") ?? [];
        },
    });

    const warehouseOptions = useMemo(() => {
        if (!warehousesData) return [];
        return warehousesData
            .filter((w) => w.camp_id === campId)
            .map((w) => ({ id: w.id, label: w.name }));
    }, [warehousesData, campId]);

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
        setIsFormOpen(true);
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

    const handleExecute = async (data: Parameters<typeof executeProduction.mutateAsync>[0]) => {
        const result = await executeProduction.mutateAsync(data);
        return result;
    };

    const handleClear = () => {
        setSelectedRule(undefined);
    };

    return (
        <article className="flex flex-1 min-h-0 flex-col rmm-content-pad bg-transparent">
            <div className="flex min-h-0 flex-1 overflow-hidden bg-black/50 backdrop-blur-lg border border-border-default">

                <div className="flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden">
                    {/* Rules table panel */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <header className="rmm-panel-header border-b border-border-default bg-bg-secondary/30 shrink-0">
                            <div className="flex items-center gap-2">
                                <Settings2 className="h-4 w-4 text-accent" />
                                <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide">
                                    Production Rules
                                </div>
                            </div>
                            <button
                                onClick={() => setShowExecutePanel(true)}
                                className="rmm-btn rmm-btn-accent text-[9px] px-3 py-1.5 flex items-center gap-1.5 w-full sm:w-auto"
                            >
                                <Play className="h-3 w-3" />
                                EXECUTE DAILY PRODUCTION
                            </button>
                        </header>
                        <div className="flex-1 overflow-auto p-4">
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
                        <PaginationFooter
                            page={pagination.page}
                            setPage={setPage}
                            totalPages={pagination.totalPages}
                            totalRecords={pagination.total}
                            className="px-4 py-1.5 border-border-default"
                            leftContent={
                                <span>
                                    Total: <span className="text-accent font-bold">{String(pagination.total).padStart(4, "0")}</span>
                                    {/* <span className="opacity-30 mx-4">|</span>
                                    Scope: <span className="text-status-ok font-bold">[RULES]</span> */}
                                </span>
                            }
                        />
                    </div>
                    <CollapsibleSidePanel
                        isOpen={isFormOpen}
                        label="Production rule form"
                        widthClassName="lg:w-100"
                        onOpen={() => setIsFormOpen(true)}
                        onClose={() => setIsFormOpen(false)}
                    >
                        <CollapsiblePanelHeader
                            title="Production Rule"
                            subtitle={selectedRule ? "Edit selected rule" : "Create a new rule"}
                            onClose={() => setIsFormOpen(false)}
                        />
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
                    </CollapsibleSidePanel>
                </div>
            </div>

            {/* Execute Daily Production Modal */}
            {showExecutePanel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="relative bg-bg-tertiary/90 backdrop-blur-lg border border-border-default w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-bg-secondary/50">
                            <div className="flex items-center gap-2">
                                <Play className="h-4 w-4 text-accent" />
                                <span className="font-mono text-[10px] font-bold text-txt-primary uppercase tracking-widest">
                                    Daily Production Execution
                                </span>
                            </div>
                            <button
                                onClick={() => setShowExecutePanel(false)}
                                className="p-1.5 hover:bg-bg-secondary border border-transparent hover:border-border-default transition-all text-txt-muted hover:text-txt-primary"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-5">
                            <ProductionExecutionPanel
                                campId={campId}
                                warehouseOptions={warehouseOptions}
                                onExecute={handleExecute}
                            />
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}
