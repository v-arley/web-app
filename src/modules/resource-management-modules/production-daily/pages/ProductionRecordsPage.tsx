import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { useProductionRulesQuery } from "../hooks/useProductionRulesQuery";
import { PersonService } from "../../../../services/PersonService";
import { ResourceService } from "../../../../services/ResourceService";
import { WarehouseService } from "../../../../services/WarehouseService";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import PaginationFooter from "../../shared/components/PaginationFooter";
import { ProductionAdjustmentForm } from "../components/ProductionAdjustmentForm";
import { ProductionRecordsTable } from "../components/ProductionRecordsTable";
import { useProductionRecordMutation } from "../hooks/useProductionRecordMutation";
import { useProductionRecordsQuery } from "../hooks/useProductionRecordsQuery";
import type { ProductionRecordFormValues } from "../schemas/production-record.schema";
import { useToast } from "../../../../shared/hooks/useToast";
import { useDebounce } from "../../../../shared/hooks/useDebounce";
import CollapsibleSidePanel, { CollapsiblePanelHeader, getInitialSidePanelOpenState } from "../../shared/components/CollapsibleSidePanel";

const personService = new PersonService();
const resourceService = new ResourceService();
const warehouseService = new WarehouseService();

export function ProductionRecordsPage() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

    const [personId, setPersonId] = useState<number | undefined>(undefined);
    const [resourceId, setResourceId] = useState<number | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(getInitialSidePanelOpenState);
    const pageSize = 20;
    const { toast } = useToast();

    // Debounce filters
    const debouncedPersonId = useDebounce(personId, 500);
    const debouncedResourceId = useDebounce(resourceId, 500);

    const filters = useMemo(() => ({
        personId: debouncedPersonId,
        resourceId: debouncedResourceId,
        page,
        limit: pageSize,
    }), [debouncedPersonId, debouncedResourceId, page]);

    const { data: recordsResult, isLoading } = useProductionRecordsQuery(campId, filters);
    const records = recordsResult?.items ?? [];
    const pagination = recordsResult?.pagination ?? { page, limit: pageSize, total: 0, totalPages: 1 };
    const recordMutation = useProductionRecordMutation();

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

    // Obtener personas del campamento desde el backend
    const { data: personsData } = useQuery({
        queryKey: ["persons", campId],
        queryFn: async () => {
            const response = await personService.findAll();
            const all = response.getResultado<{ id: number; name: string; last_name: string; camp_id: number }[]>("registros") ?? [];
            return all.filter((p) => p.camp_id === campId);
        },
        enabled: campId > 0,
    });

    const personOptions = useMemo(() => {
        if (!personsData) return [];
        return personsData.map((p) => ({
            id: p.id,
            label: `${p.name} ${p.last_name}`.trim(),
        }));
    }, [personsData]);

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
    }, [personOptions]);

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
            toast({ tone: "success", title: "Adjustment recorded", message: "Manual production adjustment saved successfully." });
        } catch (error) {
            toast({
                tone: "error",
                title: "Record failed",
                message: error instanceof Error ? error.message : "Failed to record the adjustment.",
            });
        }
    };

    const { data: activeRulesResult } = useProductionRulesQuery(campId, true, { page: 1, limit: 6 });
    const activeRules = activeRulesResult?.items ?? [];

    return (
        <article className="flex flex-1 min-h-0 flex-col rmm-content-pad overflow-hidden bg-transparent">
            <div className="flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden bg-black/50 backdrop-blur-lg border border-border-default">
                <div className="flex-1 overflow-auto">
                    <div className="">
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <header className="rmm-panel-header border-b border-border-default bg-bg-secondary/30 shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide">
                                        Search Filters
                                    </div>
                                </div>

                                <div className="rmm-panel-actions">
                                    <label className="flex min-w-0 items-center overflow-hidden gap-2">
                                        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-txt-disabled">
                                        Worker
                                    </span>
                                    <select
                                        value={personId ?? 0}
                                        onChange={(e) => {
                                            setPersonId(Number(e.target.value) || undefined);
                                            setPage(1);
                                        }}
                                        className="rmm-input min-w-0 text-xs"
                                    >
                                        <option value={0}>All</option>
                                        {personOptions.map((p) => (
                                            <option key={p.id} value={p.id}>{p.label}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="flex min-w-0 items-center overflow-hidden gap-2">
                                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-txt-disabled">
                                        Resource
                                    </span>
                                    <select
                                        value={resourceId ?? 0}
                                        onChange={(e) => {
                                            setResourceId(Number(e.target.value) || undefined);
                                            setPage(1);
                                        }}
                                        className="rmm-input min-w-0 text-xs"
                                    >
                                        <option value={0}>All</option>
                                        {resourceOptions.map((r) => (
                                            <option key={r.id} value={r.id}>{r.label}</option>
                                        ))}
                                    </select>
                                </label>
                                </div>
                            </header>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center h-64 text-txt-disabled font-mono text-xs">
                                Loading production records...
                            </div>
                        ) : (
                            <ProductionRecordsTable
                                records={records}
                                personMap={personMap}
                                warehouseMap={warehouseMap}
                                resourceMap={resourceMap}
                            />
                        )}
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
                                    Scope: <span className="text-status-ok font-bold">[RECORDS]</span> */}
                                </span>
                            }
                        />
                    </div>
                </div>

                <CollapsibleSidePanel
                    isOpen={isFormOpen}
                    label="Production adjustment form"
                    widthClassName="lg:w-100"
                    onOpen={() => setIsFormOpen(true)}
                    onClose={() => setIsFormOpen(false)}
                >
                    <CollapsiblePanelHeader
                        title="Manual Adjustment"
                        subtitle="Register production output"
                        onClose={() => setIsFormOpen(false)}
                    />
                    {/* Active rules context */}
                    {activeRules.length > 0 && (
                        <div className="border-b border-border-default">
                            <div className="px-4 py-3 border-b border-border-default bg-bg-secondary/30 flex items-center gap-2">
                                <BookOpen className="h-3.5 w-3.5 text-accent" />
                                <span className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest">
                                    Active Rules ({activeRules.length})
                                </span>
                            </div>
                            <div className="max-h-36 overflow-auto">
                                {activeRules.slice(0, 6).map((rule, i) => (
                                    <div key={i} className="flex items-center justify-between px-4 py-2 border-b border-border-default/40 text-[9px] font-mono">
                                        <span className="text-txt-secondary truncate max-w-30">
                                            {resourceMap.get(rule.resource_id) ?? `RES #${rule.resource_id}`}
                                        </span>
                                        <span className="text-accent font-bold shrink-0 ml-2">
                                            {rule.expected_amount} / person
                                        </span>
                                    </div>
                                ))}
                                {activeRules.length > 6 && (
                                    <div className="px-4 py-1.5 text-[9px] font-mono text-txt-disabled">
                                        +{activeRules.length - 6} more rules
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex min-h-0 flex-1 flex-col bg-bg-primary/20 relative overflow-hidden">
                        <ProductionAdjustmentForm
                            personOptions={personOptions}
                            warehouseOptions={warehouseOptions}
                            resourceOptions={resourceOptions}
                            isSubmitting={recordMutation.create.isPending}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </CollapsibleSidePanel>
            </div>
        </article>
    );
}
