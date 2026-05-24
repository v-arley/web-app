import { AxiosBaseService } from "../../../../services/AxiosBaseService";
import type { BackendResponse } from "../../../../utils/Response";
import type { ProductionExecutionFormValues, ProductionExecutionResult } from "../schemas/production-execution.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aún no existe o el contrato no es válido.";

export class ProductionExecutionService extends AxiosBaseService {
    async executeDailyProduction(payload: ProductionExecutionFormValues): Promise<ProductionExecutionResult> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: unknown }> | unknown>(
                "/production/execute-daily",
                payload
            );
            
            return this.normalizeResult(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    private normalizeResult(input: unknown): ProductionExecutionResult {
        const source = (input ?? {}) as Record<string, unknown>;
        return {
            success: Boolean(source.success ?? false),
            total_persons: Number(source.total_persons ?? 0),
            total_productions: Number(source.total_productions ?? 0),
            total_errors: Number(source.total_errors ?? 0),
            productions: Array.isArray(source.productions) ? source.productions : [],
            errors: Array.isArray(source.errors) ? source.errors : undefined,
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

export const productionExecutionService = new ProductionExecutionService();
