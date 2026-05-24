import { useQuery } from "@tanstack/react-query";
import { productionRuleService } from "../services/ProductionRuleService";

export const PRODUCTION_RULES_QUERY_KEY = ["production-rules"];

export function useProductionRulesQuery(campId: number, enabled = true) {
    return useQuery({
        queryKey: [...PRODUCTION_RULES_QUERY_KEY, campId],
        queryFn: () => productionRuleService.getProductionRules(campId),
        enabled: enabled && campId > 0,
    });
}
