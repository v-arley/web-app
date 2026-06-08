import { useQuery } from "@tanstack/react-query";
import { productionRecordService } from "../services/ProductionRecordService";

export const PRODUCTION_RECORDS_QUERY_KEY = ["production-records"];

interface ProductionRecordsFilters {
    startDate?: string;
    endDate?: string;
    personId?: number;
    resourceId?: number;
    page?: number;
    limit?: number;
}

export function useProductionRecordsQuery(
    campId: number,
    filters?: ProductionRecordsFilters,
    enabled = true
) {
    return useQuery({
        queryKey: [...PRODUCTION_RECORDS_QUERY_KEY, campId, filters],
        queryFn: () => productionRecordService.getProductionRecords(campId, filters),
        enabled: enabled && campId > 0,
    });
}
