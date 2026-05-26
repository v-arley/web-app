import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rationService } from "../services/RationService";
import { RATIONS_QUERY_KEY } from "./useRationsQuery";
import type { RationFormValues } from "../schemas/ration.schema";

export function useRationMutation() {
    const queryClient = useQueryClient();

    const updateRation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<RationFormValues> }) =>
            rationService.updateRation(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RATIONS_QUERY_KEY });
        },
    });

    const markAsDelivered = useMutation({
        mutationFn: ({ id, notes }: { id: number; notes?: string }) =>
            rationService.markAsDelivered(id, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RATIONS_QUERY_KEY });
        },
    });

    const markAsNotDelivered = useMutation({
        mutationFn: ({ id, notes }: { id: number; notes?: string }) =>
            rationService.markAsNotDelivered(id, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RATIONS_QUERY_KEY });
        },
    });

    return {
        updateRation,
        markAsDelivered,
        markAsNotDelivered,
    };
}
