import { AxiosBaseService } from "../../../../services/AxiosBaseService";
import type { BackendResponse, BackendListPayload } from "../../../../utils/Response";
import { rationSchema, type RationFormValues } from "../schemas/ration.schema";

export class RationService extends AxiosBaseService {
    async getRations(campId: number, filters?: {
        startDate?: string;
        endDate?: string;
        completed?: 'Y' | 'N';
    }): Promise<RationFormValues[]> {
        try {
            const params = new URLSearchParams();
            params.append('camp_id', campId.toString());
            if (filters?.startDate) params.append('start_date', filters.startDate);
            if (filters?.endDate) params.append('end_date', filters.endDate);
            if (filters?.completed) params.append('completed', filters.completed);

            const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>(
                `/rations?${params.toString()}`
            );
            
            const items = this.extractItems<unknown>(data);
            return items.map((item) => this.normalizeRation(item));
        } catch (error) {
            throw new Error(this.extractErrorMessage(error, "Error al obtener raciones"));
        }
    }

    async getRationById(id: number): Promise<RationFormValues> {
        try {
            const { data } = await this.client.get<BackendResponse<{ item: unknown }> | unknown>(
                `/rations/${id}`
            );
            
            return this.normalizeRation(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.extractErrorMessage(error, "Error al obtener ración"));
        }
    }

    async updateRation(id: number, payload: Partial<RationFormValues>): Promise<RationFormValues> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: unknown }> | unknown>(
                `/rations/${id}`,
                this.toWritePayload(payload)
            );
            
            return this.normalizeRation(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.extractErrorMessage(error, "Error al actualizar ración"));
        }
    }

    async markAsDelivered(id: number, notes?: string): Promise<RationFormValues> {
        return this.updateRation(id, { completed: 'Y', notes });
    }

    async markAsNotDelivered(id: number, notes?: string): Promise<RationFormValues> {
        return this.updateRation(id, { completed: 'N', notes });
    }

    private normalizeRation(input: unknown): RationFormValues {
        const source = (input ?? {}) as Record<string, unknown>;
        return rationSchema.parse({
            id: source.id ?? null,
            person_id: source.person_id ?? 0,
            camp_id: source.camp_id ?? 0,
            completed: source.completed ?? 'N',
            ration_date: source.ration_date ?? "",
            notes: source.notes ?? null,
            created_at: source.created_at ?? null,
        });
    }

    private toWritePayload(payload: Partial<RationFormValues>) {
        return {
            person_id: payload.person_id,
            camp_id: payload.camp_id,
            completed: payload.completed,
            ration_date: payload.ration_date,
            notes: payload.notes?.trim() || undefined,
        };
    }
}

export const rationService = new RationService();
