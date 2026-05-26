import { AxiosBaseService } from "../../../../shared/utils/AxiosBaseService";
import type { BackendListPayload, BackendResponse } from "../../../../shared/utils/Response";
import { resourceSchema, type ResourceFormValues } from "../schemas/resource.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aun no existe o el contrato no es valido.";

export class ResourceCatalogService extends AxiosBaseService {
    async getResources(): Promise<ResourceFormValues[]> {
        try {
            const { data } = await this.client.get< BackendResponse<BackendListPayload<unknown>> | unknown[] >("/resources");
            const items = this.extractItems<unknown>(data);
            
            return items.map((item) => this.normalizeResource(item));
        } catch (error) {
            throw new Error(this.resolveCatalogError(error));
        }
    }

    async createResource(payload: ResourceFormValues): Promise<ResourceFormValues> {
        try {
            const { data } = await this.client.post< BackendResponse<{ item: unknown }> | unknown >("/resources", this.toWritePayload(payload));
            
            return this.normalizeResource(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveCatalogError(error));
        }
    }

    async updateResource(id: number, payload: Partial<ResourceFormValues>): Promise<ResourceFormValues> {
        try {
            const { data } = await this.client.put< BackendResponse<{ item: unknown }> | unknown >(`/resources/${id}`, this.toWritePayload(payload));
            
            return this.normalizeResource(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveCatalogError(error));
        }
    }

    async removeResource(id: number): Promise<void> {
        try {
            await this.client.delete(`/resources/${id}`);
        } catch (error) {
            throw new Error(this.resolveCatalogError(error));
        }
    }

    private normalizeResource(input: unknown): ResourceFormValues {
        const source = (input ?? {}) as Record<string, unknown>;
        return resourceSchema.parse({
            id: source.id ?? null,
            code: source.code ?? "",
            name: source.name ?? "",
            description: source.description ?? "",
            unitOfMeasure: source.unitOfMeasure ?? source.unit_of_measure ?? "",
            consumable: source.consumable === true || source.consumable === "Y",
            category: source.category ?? "",
            status: source.status ?? null,
            state: source.state ?? "A",
            created_at: source.created_at ?? null,
        });
    }

    private toWritePayload(payload: Partial<ResourceFormValues>) {
        return {
            code: payload.code?.trim().toUpperCase(),
            name: payload.name?.trim(),
            description: payload.description?.trim() || "",
            unit_of_measure: payload.unitOfMeasure?.trim(),
            consumable: payload.consumable == null ? undefined : payload.consumable ? "Y" : "N",
            category: payload.category?.trim().toUpperCase(),
            status: payload.status || undefined,
            state: payload.state,
        };
    }

    private resolveCatalogError(error: unknown) {
        const extracted = this.extractErrorMessage(error, CONTRACT_ERROR_MESSAGE).trim();
        if (!extracted || extracted.includes("404") || extracted.includes("Cannot")) {
            return CONTRACT_ERROR_MESSAGE;
        }
        return extracted;
    }
}

export const resourceCatalogService = new ResourceCatalogService();

