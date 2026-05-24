import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rationExecutionService } from "../services/RationExecutionService";
import { RATIONS_QUERY_KEY } from "./useRationsQuery";
import type { RationExecutionFormValues } from "../schemas/ration-execution.schema";

export const RATION_EXECUTION_QUERY_KEY = ["ration-execution"];

export function useExecuteDailyRations() {
    const queryClient = useQueryClient();

    const execute = useMutation({
        mutationFn: (data: RationExecutionFormValues) =>
            rationExecutionService.executeRationGeneration(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RATIONS_QUERY_KEY });
        },
    });

    return { execute };
}

export function useCheckExistingRations(campId: number, rationDate: string, enabled = true) {
    return useQuery({
        queryKey: [...RATION_EXECUTION_QUERY_KEY, "check", campId, rationDate],
        queryFn: () => rationExecutionService.checkExistingRations(campId, rationDate),
        enabled: enabled && campId > 0 && rationDate.length > 0,
    });
}

export function usePreviewRationGeneration(campId: number, rationDate: string, enabled = true) {
    return useQuery({
        queryKey: [...RATION_EXECUTION_QUERY_KEY, "preview", campId, rationDate],
        queryFn: () => rationExecutionService.previewRationGeneration(campId, rationDate),
        enabled: enabled && campId > 0 && rationDate.length > 0,
    });
}
