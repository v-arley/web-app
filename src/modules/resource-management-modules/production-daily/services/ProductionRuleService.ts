import { AxiosBaseService } from "../../../../services/AxiosBaseService";
import type { BackendResponse, BackendListPayload } from "../../../../utils/Response";
import { productionRuleSchema, type ProductionRuleFormValues } from "../schemas/production-rule.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aún no existe o el contrato no es válido.";

export class ProductionRuleService extends AxiosBaseService {
    async getProductionRules(campId: number): Promise<ProductionRuleFormValues[]> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>( `/production-rules/camp/${campId}` );
            
            const items = this.extractItems<unknown>(data);
            return items.map((item) => this.normalizeRule(item));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    async createProductionRule(payload: ProductionRuleFormValues): Promise<ProductionRuleFormValues> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: unknown }> | unknown>( "/production-rules", this.toWritePayload(payload) );
            
            return this.normalizeRule(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    async updateProductionRule(id: number, payload: ProductionRuleFormValues): Promise<ProductionRuleFormValues> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: unknown }> | unknown>( `/production-rules/${id}`, this.toWritePayload(payload) );
            
            return this.normalizeRule(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    async deleteProductionRule(id: number): Promise<void> {
        try {
            await this.client.delete(`/production-rules/${id}`);
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    private normalizeRule(input: unknown): ProductionRuleFormValues {
        const source = (input ?? {}) as Record<string, unknown>;
        return productionRuleSchema.parse({
            id: source.id ?? null,
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
