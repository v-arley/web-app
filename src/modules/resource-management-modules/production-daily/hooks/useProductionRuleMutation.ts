import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductionRuleFormValues } from "../schemas/production-rule.schema";
import { productionRuleService } from "../services/ProductionRuleService";
import { PRODUCTION_RULES_QUERY_KEY } from "./useProductionRulesQuery";

export function useProductionRuleMutation() {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (data: ProductionRuleFormValues) => productionRuleService.createProductionRule(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTION_RULES_QUERY_KEY });
        },
    });

    const update = useMutation({
        mutationFn: ({ currentRule, data }: { currentRule: ProductionRuleFormValues; data: ProductionRuleFormValues }) =>
            productionRuleService.updateProductionRule(currentRule, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTION_RULES_QUERY_KEY });
        },
    });

    const remove = useMutation({
        mutationFn: (rule: ProductionRuleFormValues) => productionRuleService.deleteProductionRule(rule),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTION_RULES_QUERY_KEY });
        },
    });

    return { create, update, remove };
}
