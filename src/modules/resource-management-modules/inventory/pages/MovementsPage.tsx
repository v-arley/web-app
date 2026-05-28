import { useQuery } from "@tanstack/react-query";
import { PackagePlus } from "lucide-react";
import { useMemo, useState } from "react";
import { ResourceService } from "../../../../services/ResourceService";
import { WarehouseService } from "../../../../services/WarehouseService";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { useToast } from "../../../../shared/hooks/useToast";
import { MovementForm } from "../components/MovementForm";
import { useMovementMutation } from "../hooks/useMovementMutation";
import type { ResourceMovementFormValues } from "../schemas/resource-movement.schema";

const resourceService = new ResourceService();
const warehouseService = new WarehouseService();

export function MovementsPage() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

    const { toast } = useToast();
    const [initialData, setInitialData] = useState<Partial<ResourceMovementFormValues> | undefined>(undefined);

    const movementMutation = useMovementMutation();

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

    const handleSubmit = async (values: ResourceMovementFormValues) => {
        try {
            await movementMutation.create.mutateAsync(values);
            toast({
                tone: "success",
                title: "Movement registered",
                message: "The movement was successfully recorded.",
            });
            setInitialData(undefined);
        } catch (error) {
            toast({
                tone: "error",
                title: "Registration failed",
                message: error instanceof Error ? error.message : "Could not record the movement.",
            });
        }
    };

    const handleClear = () => {
        setInitialData(undefined);
    };

    return (
        <div className="flex flex-1 min-h-0 flex-col p-4 md:p-6 bg-bg-app gap-4">
            {/* <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
                    Gestión de Inventario / Registrar Movimiento
                </div>
                <PackagePlus className="h-5 w-5 text-accent" />
            </div> */}

            <div className="relative flex min-h-0 flex-1 overflow-hidden bg-bg-secondary border border-border-default">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

                <div className="flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden">
                    <div className="flex-1 flex items-center justify-center bg-bg-primary/10 border-r border-border-default">
                        <div className="text-center px-8 py-12 max-w-md">
                            <PackagePlus className="h-16 w-16 text-accent/30 mx-auto mb-4" />
                            <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em] mb-2">
                                Type of Movement
                            </div>
                            <div className="space-y-3 text-left">
                                <div className="p-3 bg-bg-tertiary border border-border-default">
                                    <div className="font-mono text-[10px] font-bold text-status-ok mb-1">IN (I)</div>
                                    <div className="font-mono text-[9px] text-txt-secondary">
                                        Resources enter the warehouse
                                    </div>
                                </div>
                                <div className="p-3 bg-bg-tertiary border border-border-default">
                                    <div className="font-mono text-[10px] font-bold text-status-warning mb-1">OUT (O)</div>
                                    <div className="font-mono text-[9px] text-txt-secondary">
                                        Resources leave the warehouse
                                    </div>
                                </div>
                                <div className="p-3 bg-bg-tertiary border border-border-default">
                                    <div className="font-mono text-[10px] font-bold text-accent mb-1">ADJUST (A)</div>
                                    <div className="font-mono text-[9px] text-txt-secondary">
                                        Inventory adjustment (+/-)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="flex w-full flex-col lg:w-[380px] shrink-0 bg-bg-primary/20 border-l border-border-default relative overflow-hidden">
                        <MovementForm
                            key={JSON.stringify(initialData)}
                            warehouseOptions={warehouseOptions}
                            resourceOptions={resourceOptions}
                            initialData={initialData}
                            isSubmitting={movementMutation.create.isPending}
                            onSubmit={handleSubmit}
                            onClear={handleClear}
                        />
                    </aside>
                </div>
            </div>
        </div>
    );
}
