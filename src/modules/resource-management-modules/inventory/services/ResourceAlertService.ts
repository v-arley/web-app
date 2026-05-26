import { AxiosBaseService } from "../../../../shared/utils/AxiosBaseService";
import type { BackendListPayload, BackendResponse } from "../../../../shared/utils/Response";
import { resourceAlertSchema, type ResourceAlertFormValues } from "../schemas/resource-alert.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aun no existe o el contrato no es valido.";

export class ResourceAlertService extends AxiosBaseService {
    async getAlerts(campId: number, resolved: "Y" | "N" = "N"): Promise<ResourceAlertFormValues[]> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>(
                `/camps/${campId}/resource-alerts?resolved=${resolved}`
            );
            const items = this.extractItems<unknown>(data);
            
            return items.map((item) => this.normalizeAlert(item));
        } catch (error) {
            throw new Error(this.resolveInventoryError(error));
        }
    }

    async resolveAlert(alertId: number): Promise<void> {
        try {
            await this.client.patch(`/resource-alerts/${alertId}/resolve`);
        } catch (error) {
            throw new Error(this.resolveInventoryError(error));
        }
    }

    private normalizeAlert(input: unknown): ResourceAlertFormValues {
        const source = (input ?? {}) as Record<string, unknown>;
        return resourceAlertSchema.parse({
            id: source.id ?? null,
            warehouse_id: source.warehouse_id ?? 0,
            warehouse_name: source.warehouse_name ?? "",
            resource_id: source.resource_id ?? 0,
            resource_code: source.resource_code ?? "",
            resource_name: source.resource_name ?? "",
            current_amount: source.current_amount ?? 0,
            min_quantity: source.min_quantity ?? 0,
            alert_date: source.alert_date ?? null,
            resolved: source.resolved ?? "N",
            resolved_at: source.resolved_at ?? null,
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

export const resourceAlertService = new ResourceAlertService();

