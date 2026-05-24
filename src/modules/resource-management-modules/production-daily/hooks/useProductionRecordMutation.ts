import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductionRecordFormValues } from "../schemas/production-record.schema";
import { productionRecordService } from "../services/ProductionRecordService";
import { PRODUCTION_RECORDS_QUERY_KEY } from "./useProductionRecordsQuery";

export function useProductionRecordMutation() {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (data: ProductionRecordFormValues) => productionRecordService.createProductionRecord(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTION_RECORDS_QUERY_KEY });
        },
    });

    const update = useMutation({
        mutationFn: ({ id, data }: { id: number; data: ProductionRecordFormValues }) =>
            productionRecordService.updateProductionRecord(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTION_RECORDS_QUERY_KEY });
        },
    });

    return { create, update };
}
