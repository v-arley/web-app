import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ResourceFormValues } from "../schemas/resource.schema";
import { resourceCatalogService } from "../services/ResourceCatalogService";
import { RESOURCES_QUERY_KEY } from "./useResourceQuery";

export function useResourceMutations() {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (data: ResourceFormValues) => resourceCatalogService.createResource(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY }),
    });

    const update = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<ResourceFormValues> }) =>
            resourceCatalogService.updateResource(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY }),
    });

    const remove = useMutation({
        mutationFn: (id: number) => resourceCatalogService.removeResource(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY }),
    });

    return { create, update, remove };
}
