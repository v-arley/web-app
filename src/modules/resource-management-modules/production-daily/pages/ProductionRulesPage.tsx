import { useQuery } from "@tanstack/react-query";
import { Play, X } from "lucide-react";
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

    const { data: warehousesData } = useQuery({
        queryKey: ["warehouses", campId],
        queryFn: async () => {
            const response = await warehouseService.findAll();
            return response.getResultado<{ id: number; name: string; camp_id: number }[]>("registros") ?? [];
        },
        enabled: campId > 0,
    });

    const { data: resourcesData } = useQuery({
        queryKey: ["resources"],
        queryFn: async () => {
            const response = await resourceService.findAll();
            return response.getResultado<{ id: number; code: string; name: string }[]>("registros") ?? [];
        },
    });

    const { data: professionsData } = useQuery({
        queryKey: ["professions"],
        queryFn: async () => {
            const response = await professionService.findAll();
            return response.getResultado<{ id: number; name: string }[]>("registros") ?? [];
        },
    });

    const warehouseOptions = useMemo(() => {
        if (!warehousesData) return [];
        return warehousesData.filter((w) => w.camp_id === campId).map((w) => ({ id: w.id, label: w.name }));
    }, [warehousesData, campId]);

    const professionOptions = useMemo(() => {
        if (!professionsData) return [];
        return professionsData.map((p) => ({ id: p.id!, label: p.name }));
    }, [professionsData]);

    const resourceOptions = useMemo(() => {
        if (!resourcesData) return [];
        return resourcesData.map((r) => ({ id: r.id, label: `${r.code} - ${r.name}` }));
    }, [resourcesData]);

    const professionMap = useMemo(() => new Map(professionOptions.map((p) => [p.id, p.label])), [professionOptions]);
    const resourceMap   = useMemo(() => {
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
            toast({ tone: "error", title: "Save failed", message: error instanceof Error ? error.message : "Failed to save the production rule." });
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
            toast({ tone: "error", title: "Delete failed", message: error instanceof Error ? error.message : "Failed to delete the production rule." });
        }
    };

    const handleExecute = async (data: Parameters<typeof executeProduction.mutateAsync>[0]) => {
        return executeProduction.mutateAsync(data);
    };

    return (
        <>
        <div className="app-split app-split--glass" style={{ flex: 1, minHeight: 0 }}>
            <div className="app-split__inner">
                    <div className="app-split__main">
                        <header className="app-panel-header">
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span className="app-panel-title">Production Rules</span>
                            </div>
                            <button
                                onClick={() => setShowExecutePanel(true)}
                                className="app-btn app-btn--primary app-btn--sm"
                            >
                                <Play style={{ width: "0.75rem", height: "0.75rem" }} />
                                EXECUTE DAILY PRODUCTION
                            </button>
                        </header>

                        <div className="app-table-region app-table-frame">
                            {isLoading ? (
                                <div className="app-loading-state" style={{ flexDirection: "column", gap: "0.5rem" }}>
                                    <div className="app-spinner app-spinner--lg" />
                                    <span className="app-eyebrow" style={{ letterSpacing: "0.35em" }}>Loading Rules...</span>
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
                            leftContent={
                                <span>
                                    Total: <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>{String(pagination.total).padStart(4, "0")}</span>
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
                            onClear={() => setSelectedRule(undefined)}
                            onDelete={handleDelete}
                        />
                    </CollapsibleSidePanel>
                </div>
        </div>

        {showExecutePanel && (
                <div className="app-overlay">
                    <div className="app-modal app-card--glass" style={{ display: "flex", flexDirection: "column" }}>
                        <div className="app-panel-header">
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Play style={{ width: "1rem", height: "1rem", color: "var(--color-accent)" }} />
                                <span className="app-panel-title">Daily Production Execution</span>
                            </div>
                            <button
                                onClick={() => setShowExecutePanel(false)}
                                className="app-btn app-btn--ghost app-btn--icon app-btn--sm"
                            >
                                <X style={{ width: "1rem", height: "1rem" }} />
                            </button>
                        </div>
                        <div className="app-panel-body">
                            <ProductionExecutionPanel
                                campId={campId}
                                warehouseOptions={warehouseOptions}
                                onExecute={handleExecute}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
