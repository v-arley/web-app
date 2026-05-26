import { AxiosBaseService } from "../../../../shared/utils/AxiosBaseService";
import type { BackendResponse, BackendListPayload } from "../../../../shared/utils/Response";
import { requestResourceSchema, type RequestResourceFormValues } from "../schemas/request-resource.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aún no existe o el contrato no es válido.";

export class RequestResourceService extends AxiosBaseService {
    /**
     * Obtener recursos de una solicitud
     */
    async getRequestResources(requestId: number): Promise<RequestResourceFormValues[]> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>( `/request-resources?request_id=${requestId}` );
            
            const items = this.extractItems<unknown>(data);
            return items.map((item) => this.normalizeRequestResource(item));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    /**
     * Crear recursos para una solicitud (bulk)
     */
    async createRequestResources(requestId: number, resources: Array<{ resource_id: number; amount: number }>): Promise<RequestResourceFormValues[]> {
        try {
            const { data } = await this.client.post<BackendResponse<{ items: unknown[] }> | unknown[]>(
                "/request-resources/bulk",
                {
                    request_id: requestId,
                    resources,
                }
            );
            
            const items = Array.isArray(data) ? data : (data as any)?.items ?? [];
            return items.map((item: unknown) => this.normalizeRequestResource(item));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    private normalizeRequestResource(input: unknown): RequestResourceFormValues {
        const source = (input ?? {}) as Record<string, unknown>;
        return requestResourceSchema.parse({
            id: source.id ?? null,
            request_id: source.request_id ?? 0,
            resource_id: source.resource_id ?? 0,
            amount: source.amount ?? 0,
        });
    }

    private resolveError(error: unknown) {
        const extracted = this.extractErrorMessage(error, CONTRACT_ERROR_MESSAGE).trim();
        if (!extracted || extracted.includes("404") || extracted.includes("Cannot")) {
            return CONTRACT_ERROR_MESSAGE;
        }
        return extracted;
    }
}

export const requestResourceService = new RequestResourceService();

