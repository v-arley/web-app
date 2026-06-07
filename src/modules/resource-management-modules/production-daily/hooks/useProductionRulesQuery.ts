import { useQuery } from "@tanstack/react-query";
import { productionRuleService } from "../services/ProductionRuleService";

export const PRODUCTION_RULES_QUERY_KEY = ["production-rules"];

export function useProductionRulesQuery(campId: number, enabled = true, pagination?: { page?: number; limit?: number }) {
    return useQuery({
        queryKey: [...PRODUCTION_RULES_QUERY_KEY, campId, pagination],
        queryFn: () => productionRuleService.getProductionRules(campId, pagination),
        enabled: enabled && campId > 0,
    });
}
