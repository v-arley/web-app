import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ResourceMovementFormValues } from "../schemas/resource-movement.schema";
import { resourceMovementService } from "../services/ResourceMovementService";
import { STOCK_SUMMARY_QUERY_KEY } from "./useStockSummaryQuery";

export function useMovementMutation() {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (data: ResourceMovementFormValues) => resourceMovementService.createMovement(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STOCK_SUMMARY_QUERY_KEY });
        },
    });

    return { create };
}
