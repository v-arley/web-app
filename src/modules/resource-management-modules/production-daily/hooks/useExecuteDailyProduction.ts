import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductionExecutionFormValues } from "../schemas/production-execution.schema";
import { productionExecutionService } from "../services/ProductionExecutionService";
import { PRODUCTION_RECORDS_QUERY_KEY } from "./useProductionRecordsQuery";

export function useExecuteDailyProduction() {
    const queryClient = useQueryClient();

    const execute = useMutation({
        mutationFn: (data: ProductionExecutionFormValues) => productionExecutionService.executeDailyProduction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTION_RECORDS_QUERY_KEY });
        },
    });

    return { execute };
}
