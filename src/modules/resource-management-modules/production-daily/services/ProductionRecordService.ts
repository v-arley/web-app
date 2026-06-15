import { AxiosBaseService } from "../../../../shared/utils/AxiosBaseService";
import type { BackendResponse, BackendListPayload, PaginatedResult } from "../../../../shared/utils/Response";
import { productionRecordSchema, type ProductionRecordFormValues } from "../schemas/production-record.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aún no existe o el contrato no es válido.";

export class ProductionRecordService extends AxiosBaseService {
    async getProductionRecords(campId: number, filters?: { startDate?: string; endDate?: string; personId?: number; resourceId?: number; page?: number; limit?: number; }): Promise<PaginatedResult<ProductionRecordFormValues>> {
        try {
            const params = new URLSearchParams();
            const page = filters?.page ?? 1;
            const limit = filters?.limit ?? 20;

            params.append('camp_id', campId.toString());
            params.append('page', String(page));
            params.append('limit', String(limit));
            if (filters?.startDate) 
                params.append('start_date', filters.startDate);
            if (filters?.endDate) 
                params.append('end_date', filters.endDate);
            if (filters?.personId) 
                params.append('person_id', filters.personId.toString());
            if (filters?.resourceId) 
                params.append('resource_id', filters.resourceId.toString());

            const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>( `/resource-productions/filters?${params.toString()}` );
            
            const result = this.extractPaginatedItems<unknown>(data, page, limit);
            return {
                items: result.items.map((item) => this.normalizeRecord(item)),
                pagination: result.pagination,
            };
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    async createProductionRecord(payload: ProductionRecordFormValues): Promise<ProductionRecordFormValues> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: unknown }> | unknown>( "/resource-productions", this.toWritePayload(payload) );
            
            return this.normalizeRecord(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    async updateProductionRecord(id: number, payload: ProductionRecordFormValues): Promise<ProductionRecordFormValues> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: unknown }> | unknown>( `/resource-productions/${id}`, this.toWritePayload(payload) );
            
            return this.normalizeRecord(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    private normalizeRecord(input: unknown): ProductionRecordFormValues {
        const source = (input ?? {}) as Record<string, unknown>;
        const rawId = Number(source.id);
        const rawCreatedBy = Number(source.created_by);
        return productionRecordSchema.parse({
            ...(Number.isFinite(rawId) && rawId > 0 ? { id: rawId } : {}),
            person_id: source.person_id ?? 0,
            warehouse_id: source.warehouse_id ?? 0,
            resource_id: source.resource_id ?? 0,
            amount: source.amount ?? 0,
            production_date: source.production_date ?? "",
            notes: source.notes ?? null,
            ...(Number.isFinite(rawCreatedBy) && rawCreatedBy > 0 ? { created_by: rawCreatedBy } : {}),
        });
    }

    private toWritePayload(payload: ProductionRecordFormValues) {
        return {
            person_id: payload.person_id,
            warehouse_id: payload.warehouse_id,
            resource_id: payload.resource_id,
            amount: payload.amount,
            production_date: payload.production_date,
            notes: payload.notes?.trim() || undefined,
            created_by: payload.created_by,
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

export const productionRecordService = new ProductionRecordService();

