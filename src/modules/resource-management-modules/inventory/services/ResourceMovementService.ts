import { AxiosBaseService } from "../../../../services/AxiosBaseService";
import type { BackendResponse } from "../../../../utils/Response";
import { resourceMovementSchema, type ResourceMovementFormValues } from "../schemas/resource-movement.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aun no existe o el contrato no es valido.";

export class ResourceMovementService extends AxiosBaseService {
    async createMovement(payload: ResourceMovementFormValues): Promise<ResourceMovementFormValues> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: unknown }> | unknown>(
                "/resource-movements",
                this.toWritePayload(payload)
            );
            
            return this.normalizeMovement(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveInventoryError(error));
        }
    }

    private normalizeMovement(input: unknown): ResourceMovementFormValues {
        const source = (input ?? {}) as Record<string, unknown>;
        return resourceMovementSchema.parse({
            id: source.id ?? null,
            warehouse_id: source.warehouse_id ?? 0,
            resource_id: source.resource_id ?? 0,
            movement_type: source.movement_type ?? "E",
            amount: source.amount ?? 0,
            adjustment_sign: source.adjustment_sign ?? null,
            reason: source.reason ?? "",
            created_at: source.created_at ?? null,
        });
    }

    private toWritePayload(payload: ResourceMovementFormValues) {
        return {
            warehouse_id: payload.warehouse_id,
            resource_id: payload.resource_id,
            movement_type: payload.movement_type,
            amount: payload.amount,
            adjustment_sign: payload.adjustment_sign || undefined,
            reason: payload.reason?.trim() || "",
        };
    }

    private resolveInventoryError(error: unknown) {
        const extracted = this.extractErrorMessage(error, CONTRACT_ERROR_MESSAGE).trim();
        if (!extracted || extracted.includes("404") || extracted.includes("Cannot")) {
            return CONTRACT_ERROR_MESSAGE;
        }
        return extracted;
    }
}

export const resourceMovementService = new ResourceMovementService();
