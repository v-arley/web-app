import { AxiosBaseService } from "../../../../services/AxiosBaseService";
import type { BackendResponse, BackendListPayload } from "../../../../utils/Response";
import { rationResourceSchema, type RationResourceFormValues } from "../schemas/ration-resource.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aún no existe o el contrato no es válido.";

export class RationResourceService extends AxiosBaseService {
    async getRationResources(rationId: number): Promise<RationResourceFormValues[]> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>(
                `/ration-resources?ration_id=${rationId}`
            );
            
            const items = this.extractItems<unknown>(data);
            return items.map((item) => this.normalizeRationResource(item));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    async createRationResource(payload: RationResourceFormValues): Promise<RationResourceFormValues> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: unknown }> | unknown>(
                "/ration-resources",
                this.toWritePayload(payload)
            );
            
            return this.normalizeRationResource(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    private normalizeRationResource(input: unknown): RationResourceFormValues {
        const source = (input ?? {}) as Record<string, unknown>;
        return rationResourceSchema.parse({
            ration_id: source.ration_id ?? 0,
            resource_id: source.resource_id ?? 0,
            amount: source.amount ?? 0,
        });
    }

    private toWritePayload(payload: RationResourceFormValues) {
        return {
            ration_id: payload.ration_id,
            resource_id: payload.resource_id,
            amount: payload.amount,
        };
    }
}

export const rationResourceService = new RationResourceService();
