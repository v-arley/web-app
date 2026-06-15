import { AxiosBaseService } from "../../../../shared/utils/AxiosBaseService";
import type { BackendResponse, BackendListPayload, PaginatedResult } from "../../../../shared/utils/Response";
import { productionRuleSchema, type ProductionRuleFormValues } from "../schemas/production-rule.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aún no existe o el contrato no es válido.";

export class ProductionRuleService extends AxiosBaseService {
    async getProductionRules(campId: number, pagination?: { page?: number; limit?: number }): Promise<PaginatedResult<ProductionRuleFormValues>> {
        try {
            const page = pagination?.page ?? 1;
            const limit = pagination?.limit ?? 20;
            const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>( `/camp-production-rules/camp/${campId}?page=${page}&limit=${limit}` );
            
            const result = this.extractPaginatedItems<unknown>(data, page, limit);
            return {
                items: result.items.map((item) => this.normalizeRule(item)),
                pagination: result.pagination,
            };
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    async createProductionRule(payload: ProductionRuleFormValues): Promise<ProductionRuleFormValues> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: unknown }> | unknown>( "/camp-production-rules", this.toWritePayload(payload) );
            
            return this.normalizeRule(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    async updateProductionRule(currentRule: ProductionRuleFormValues, payload: ProductionRuleFormValues): Promise<ProductionRuleFormValues> {
        try {
            const { campId, professionId, resourceId, effectiveDate } = this.extractCompositeKey(currentRule);
            const { data } = await this.client.put<BackendResponse<{ item: unknown }> | unknown>(
                `/camp-production-rules/${campId}/${professionId}/${resourceId}/${effectiveDate}`,
                this.toWritePayload(payload)
            );
            
            return this.normalizeRule(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    async deleteProductionRule(rule: ProductionRuleFormValues): Promise<void> {
        try {
            const { campId, professionId, resourceId, effectiveDate } = this.extractCompositeKey(rule);
            await this.client.delete(`/camp-production-rules/${campId}/${professionId}/${resourceId}/${effectiveDate}`);
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    private extractCompositeKey(rule: ProductionRuleFormValues) {
        return {
            campId: rule.camp_id,
            professionId: rule.profession_id,
            resourceId: rule.resource_id,
            effectiveDate: rule.effective_date,
        };
    }

    private normalizeRule(input: unknown): ProductionRuleFormValues {
        const source = (input ?? {}) as Record<string, unknown>;
        const rawId = Number(source.id);
        return productionRuleSchema.parse({
            ...(Number.isFinite(rawId) && rawId > 0 ? { id: rawId } : {}),
            camp_id: source.camp_id ?? 0,
            profession_id: source.profession_id ?? 0,
            resource_id: source.resource_id ?? 0,
            expected_amount: source.expected_amount ?? 0,
            effective_date: source.effective_date ?? "",
            end_date: source.end_date ?? null,
            state: source.state ?? "A",
        });
    }

    private toWritePayload(payload: ProductionRuleFormValues) {
        return {
            camp_id: payload.camp_id,
            profession_id: payload.profession_id,
            resource_id: payload.resource_id,
            expected_amount: payload.expected_amount,
            effective_date: payload.effective_date,
            end_date: payload.end_date || undefined,
            state: payload.state,
        };
    }

    private resolveError(error: unknown) {
        const extracted = this.extractErrorMessage(error, CONTRACT_ERROR_MESSAGE).trim();
        if (!extracted || extracted.includes("404") || extracted.includes("Cannot")) {
            return CONTRACT_ERROR_MESSAGE;
        }
        return extracted;
    }
}

export const productionRuleService = new ProductionRuleService();

