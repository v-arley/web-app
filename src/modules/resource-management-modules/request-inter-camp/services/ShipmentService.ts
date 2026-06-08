import { AxiosBaseService } from "../../../../shared/utils/AxiosBaseService";
import type { BackendResponse, BackendListPayload } from "../../../../shared/utils/Response";
import { shipmentSchema, type ShipmentFormValues } from "../schemas/shipment.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aún no existe o el contrato no es válido.";

export class ShipmentService extends AxiosBaseService {
    /**
     * Obtener envÃ­os con filtros
     */
    async getShipments(filters?: { requestId?: number; originCampId?: number; destinationCampId?: number; status?: 'P' | 'I' | 'D' | 'C'; }): Promise<ShipmentFormValues[]> {
        try {
            const params = new URLSearchParams();

            if (filters?.requestId) 
                params.append('request_id', filters.requestId.toString());
            if (filters?.originCampId)
                params.append('origin_camp_id', filters.originCampId.toString());
            if (filters?.destinationCampId)
                params.append('destination_camp_id', filters.destinationCampId.toString());
            if (filters?.status) 
                params.append('status', filters.status);

            const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>( `/shipments?${params.toString()}` );
            
            const items = this.extractItems<unknown>(data);
            return items.map((item) => this.normalizeShipment(item));
        } catch (error) {
            throw new Error(this.resolveError(error, ));
        }
    }

    /**
     * Obtener envÃ­o por ID
     */
    async getShipmentById(id: number): Promise<ShipmentFormValues> {
        try {
            const { data } = await this.client.get<BackendResponse<{ item: unknown }> | unknown>( `/shipments/${id}` );
            
            return this.normalizeShipment(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error, ));
        }
    }

    /**
     * Crear nuevo envÃ­o
     */
    async createShipment(payload: Partial<ShipmentFormValues>): Promise<ShipmentFormValues> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: unknown }> | unknown>( "/shipments", this.toWritePayload(payload) );
            
            return this.normalizeShipment(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error, ));
        }
    }

    /**
     * Iniciar trÃ¡nsito (cambiar estado a 'I')
     */
    async startTransit(id: number): Promise<ShipmentFormValues> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: unknown }> | unknown>( `/shipments/${id}/start-transit`, {} );
            
            return this.normalizeShipment(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    /**
     * Confirmar recepciÃ³n (cambiar estado a 'D')
     */
    async confirmDelivery(id: number, observations?: string): Promise<ShipmentFormValues> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: unknown }> | unknown>( `/shipments/${id}/confirm-delivery`, { observations } );
            
            return this.normalizeShipment(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    /**
     * Cancelar envÃ­o
     */
    async cancelShipment(id: number, observations?: string): Promise<ShipmentFormValues> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: unknown }> | unknown>( `/shipments/${id}/cancel`, { observations } );
            
            return this.normalizeShipment(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    private normalizeShipment(input: unknown): ShipmentFormValues {
        const source = (input ?? {}) as Record<string, unknown>;
        return shipmentSchema.parse({
            id: source.id ?? null,
            request_id: source.request_id ?? 0,
            request: source.request ?? null,
            departure_date: source.departure_date ?? new Date().toISOString(),
            arrival_date: source.arrival_date ?? null,
            status: source.status ?? 'P',
            observations: source.observations ?? null,
            created_at: source.created_at ?? null,
        });
    }

    private toWritePayload(payload: Partial<ShipmentFormValues>) {
        return {
            request_id: payload.request_id,
            departure_date: payload.departure_date,
            arrival_date: payload.arrival_date,
            status: payload.status,
            observations: payload.observations?.trim() || undefined,
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

export const shipmentService = new ShipmentService();

