import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfessionFormValues } from "../schemas/profession.schema";
import { professionCatalogService } from "../services/ProfessionCatalogService";
import { PROFESSIONS_QUERY_KEY } from "./useProfessionQuery";

export function useProfessionMutations() {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (data: ProfessionFormValues) => professionCatalogService.createProfession(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFESSIONS_QUERY_KEY }),
    });

    const update = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<ProfessionFormValues> }) =>
            professionCatalogService.updateProfession(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFESSIONS_QUERY_KEY }),
    });

    const remove = useMutation({
        mutationFn: (id: number) => professionCatalogService.removeProfession(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFESSIONS_QUERY_KEY }),
    });

    return { create, update, remove };
}
