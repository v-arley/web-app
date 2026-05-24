import { AxiosBaseService } from "../../../../services/AxiosBaseService";
import type { BackendListPayload, BackendResponse } from "../../../../utils/Response";
import { professionSchema, type ProfessionFormValues } from "../schemas/profession.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aun no existe o el contrato no es valido.";

export class ProfessionCatalogService extends AxiosBaseService {
    async getProfessions(): Promise<ProfessionFormValues[]> {
        try {
            const { data } = await this.client.get< BackendResponse<BackendListPayload<unknown>> | unknown[] >("/professions");
            const items = this.extractItems<unknown>(data);

            return items.map((item) => this.normalizeProfession(item));
        } catch (error) {
            throw new Error(this.resolveCatalogError(error));
        }
    }

    async createProfession(payload: ProfessionFormValues): Promise<ProfessionFormValues> {
        try {
            const { data } = await this.client.post< BackendResponse<{ item: unknown }> | unknown >("/professions", this.toWritePayload(payload));

            return this.normalizeProfession(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveCatalogError(error));
        }
    }

    async updateProfession(id: number, payload: Partial<ProfessionFormValues>): Promise<ProfessionFormValues> {
        try {
            const { data } = await this.client.put< BackendResponse<{ item: unknown }> | unknown >(`/professions/${id}`, this.toWritePayload(payload));
            
            return this.normalizeProfession(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveCatalogError(error));
        }
    }

    async removeProfession(id: number): Promise<void> {
        try {
            await this.client.delete(`/professions/${id}`);
        } catch (error) {
            throw new Error(this.resolveCatalogError(error));
        }
    }

    private normalizeProfession(input: unknown): ProfessionFormValues {
        const source = (input ?? {}) as Record<string, unknown>;
        return professionSchema.parse({
            id: source.id ?? null,
            code: source.code ?? "",
            name: source.name ?? "",
            description: source.description ?? "",
            default_resource_id: source.default_resource_id ?? null,
            default_production_amount: source.default_production_amount ?? null,
            state: source.state ?? "A",
            created_at: source.created_at ?? null,
        });
    }

    private toWritePayload(payload: Partial<ProfessionFormValues>) {
        return {
            code: payload.code?.trim().toUpperCase(),
            name: payload.name?.trim(),
            description: payload.description?.trim() || "",
            default_resource_id: payload.default_resource_id ?? null,
            default_production_amount: payload.default_production_amount ?? null,
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

export const professionCatalogService = new ProfessionCatalogService();
