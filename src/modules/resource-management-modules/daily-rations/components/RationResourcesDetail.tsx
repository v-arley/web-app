import { Package } from "lucide-react";
import { useRationResourcesQuery } from "../hooks/useRationResourcesQuery";
import { useQuery } from "@tanstack/react-query";
import { ResourceService } from "../../../../services/ResourceService";

const resourceService = new ResourceService();

type Props = {
    rationId: number;
};

export function RationResourcesDetail({ rationId }: Props) {
    const { data: resources, isLoading } = useRationResourcesQuery(rationId);
    
    const { data: allResources } = useQuery({
        queryKey: ["resources"],
        queryFn: async () => {
            const response = await resourceService.findAll();
            return response.getResultado<{ id: number; name: string; unit_of_measure: string }[]>("registros") ?? [];
        },
    });

    const resourceMap = new Map(allResources?.map((r) => [r.id, r]) ?? []);

    if (isLoading) {
        return (
            <div className="font-mono text-xs text-txt-disabled">
                Cargando recursos...
            </div>
        );
    }

    if (!resources || resources.length === 0) {
        return (
            <div className="font-mono text-xs text-txt-disabled">
                No resources are allocated to this ration
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                Allocated Resources
            </div>
            
            <div className="flex flex-col gap-2">
                {resources.map((resource) => {
                    const resourceData = resourceMap.get(resource.resource_id);
                    
                    return (
                        <div
                            key={`${resource.ration_id}-${resource.resource_id}`}
                            className="flex items-center gap-3 bg-bg-secondary border border-border-default p-3"
                        >
                            <Package className="w-4 h-4 text-accent-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="font-mono text-xs text-txt-primary truncate">
                                    {resourceData?.name || `ID ${resource.resource_id}`}
                                </div>
                                <div className="font-mono text-[10px] text-txt-disabled">
                                    {resource.amount} {resourceData?.unit_of_measure || 'unidades'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
