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
        mutationFn: ({ id, data }: { id: number; data: ProductionRuleFormValues }) =>
            productionRuleService.updateProductionRule(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTION_RULES_QUERY_KEY });
        },
    });

    const remove = useMutation({
        mutationFn: (id: number) => productionRuleService.deleteProductionRule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTION_RULES_QUERY_KEY });
        },
    });

    return { create, update, remove };
}
