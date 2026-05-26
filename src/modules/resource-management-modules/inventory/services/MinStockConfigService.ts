import { AxiosBaseService } from "../../../../shared/utils/AxiosBaseService";
import type { MinStockConfigFormValues } from "../schemas/min-stock-config.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aun no existe o el contrato no es valido.";

export class MinStockConfigService extends AxiosBaseService {
    async updateMinStock(payload: MinStockConfigFormValues): Promise<void> {
        try {
            await this.client.put(
                `/warehouse-resources/${payload.warehouse_id}/${payload.resource_id}`,
                { min_quantity: payload.min_quantity }
            );
        } catch (error) {
            throw new Error(this.resolveInventoryError(error));
        }
    }

    private resolveInventoryError(error: unknown) {
        const extracted = this.extractErrorMessage(error, CONTRACT_ERROR_MESSAGE).trim();
        if (!extracted || extracted.includes("404") || extracted.includes("Cannot")) {
            return CONTRACT_ERROR_MESSAGE;
        }
        return extracted;
    }
}

export const minStockConfigService = new MinStockConfigService();

