import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CampFormValues } from "../schemas/create-camp.schema";
import { campService } from "../services/campService";
import { CAMPS_QUERY_KEY } from "./useCampQuery";

export function useCampMutations() {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (data: CampFormValues) => campService.createCamp(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: CAMPS_QUERY_KEY }),
    });

    const update = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CampFormValues> }) =>
            campService.updateCamp(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: CAMPS_QUERY_KEY }),
    });

    const remove = useMutation({
        mutationFn: (id: number) => campService.removeCamp(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: CAMPS_QUERY_KEY }),
    });

    return { create, update, remove };
}
