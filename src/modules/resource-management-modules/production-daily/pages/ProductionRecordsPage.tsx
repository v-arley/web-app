import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PersonService } from "../../../../services/PersonService";
import { ResourceService } from "../../../../services/ResourceService";
import { WarehouseService } from "../../../../services/WarehouseService";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { ProductionAdjustmentForm } from "../components/ProductionAdjustmentForm";
import { ProductionRecordsTable } from "../components/ProductionRecordsTable";
import { useProductionRecordMutation } from "../hooks/useProductionRecordMutation";
import { useProductionRecordsQuery } from "../hooks/useProductionRecordsQuery";
import type { ProductionRecordFormValues } from "../schemas/production-record.schema";
import { useToast } from "../../../../shared/hooks/useToast";
import { useDebounce } from "../../../../shared/hooks/useDebounce";

const personService = new PersonService();
const resourceService = new ResourceService();
const warehouseService = new WarehouseService();

export function ProductionRecordsPage() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

    const [personId, setPersonId] = useState<number | undefined>(undefined);
    const [resourceId, setResourceId] = useState<number | undefined>(undefined);
    const { toast } = useToast();

    // Debounce filters
    const debouncedPersonId = useDebounce(personId, 500);
    const debouncedResourceId = useDebounce(resourceId, 500);

    const filters = useMemo(() => ({
        personId: debouncedPersonId,
        resourceId: debouncedResourceId,
    }), [debouncedPersonId, debouncedResourceId]);

    const { data: records = [], isLoading } = useProductionRecordsQuery(campId, filters);
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

    return (
        <div className="flex flex-1 min-h-0 flex-col p-4 md:p-6 bg-bg-app gap-4">
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
                                        Search Filters
                                    </div>
                                </div>
                                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-txt-disabled">
                                            Worker
                                        </span>
                                        <select
                                            value={personId ?? 0}
                                            onChange={(e) => setPersonId(Number(e.target.value) || undefined)}
                                            className="bg-bg-tertiary border border-border-default px-3 py-2 font-mono text-xs text-txt-primary focus:border-accent outline-none transition-all"
                                        >
                                            <option value={0}>All</option>
                                            {personOptions.map((p) => (
                                                <option key={p.id} value={p.id}>{p.label}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-txt-disabled">
                                            Resource
                                        </span>
                                        <select
                                            value={resourceId ?? 0}
                                            onChange={(e) => setResourceId(Number(e.target.value) || undefined)}
                                            className="bg-bg-tertiary border border-border-default px-3 py-2 font-mono text-xs text-txt-primary focus:border-accent outline-none transition-all"
                                        >
                                            <option value={0}>All</option>
                                            {resourceOptions.map((r) => (
                                                <option key={r.id} value={r.id}>{r.label}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
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
