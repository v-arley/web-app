import { AxiosBaseService } from "../../../../shared/utils/AxiosBaseService";
import type { BackendListPayload, BackendResponse } from "../../../../shared/utils/Response";
import { stockSummarySchema, type StockSummary } from "../schemas/stock-summary.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aun no existe o el contrato no es valido.";

export class StockSummaryService extends AxiosBaseService {
    async getStockSummary(campId: number, filters?: {
        category?: string;
        status?: string;
        warehouseId?: number;
        search?: string;
    }): Promise<StockSummary[]> {
        try {
            const params = new URLSearchParams();
            if (filters?.category) params.append("category", filters.category);
            if (filters?.status) params.append("status", filters.status);
            if (filters?.warehouseId) params.append("warehouse_id", String(filters.warehouseId));
            if (filters?.search) params.append("search", filters.search);

            const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>(
                `/camps/${campId}/stock-summary?${params.toString()}`
            );
            const items = this.extractItems<unknown>(data);
            
            return items.map((item) => this.normalizeStockSummary(item));
        } catch (error) {
            throw new Error(this.resolveInventoryError(error));
        }
    }

    private normalizeStockSummary(input: unknown): StockSummary {
        const source = (input ?? {}) as Record<string, unknown>;
        return stockSummarySchema.parse({
            warehouse_id: source.warehouse_id ?? 0,
            warehouse_name: source.warehouse_name ?? "",
            resource_id: source.resource_id ?? 0,
            resource_code: source.resource_code ?? "",
            resource_name: source.resource_name ?? "",
            category: source.category ?? "",
            unit_of_measure: source.unit_of_measure ?? "",
            current_amount: source.current_amount ?? 0,
            min_quantity: source.min_quantity ?? 0,
            stock_status: source.stock_status ?? "OK",
            date_last_movement: source.date_last_movement ?? null,
        });
    }

    private resolveInventoryError(error: unknown) {
        const extracted = this.extractErrorMessage(error, CONTRACT_ERROR_MESSAGE).trim();
        if (!extracted || extracted.includes("404") || extracted.includes("Cannot")) {
            return CONTRACT_ERROR_MESSAGE;
        }
        return extracted;
    }
}

export const stockSummaryService = new StockSummaryService();

