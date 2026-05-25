import { AxiosBaseService } from "../../../../services/AxiosBaseService";
import type { BackendResponse, BackendListPayload } from "../../../../utils/Response";
import { campRequestSchema, type CampRequestFormValues } from "../schemas/camp-request.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aún no existe o el contrato no es válido.";

export class CampRequestService extends AxiosBaseService {
    /**
     * Obtener solicitudes con filtros
     */
    async getCampRequests(filters?: { originCampId?: number; destinationCampId?: number; requestType?: 'R' | 'P'; status?: 'P' | 'A' | 'R'; originApprovalStatus?: 'P' | 'A' | 'R'; destinationApprovalStatus?: 'P' | 'A' | 'R'; }): Promise<CampRequestFormValues[]> {
        try {
            const params = new URLSearchParams();
            if (filters?.originCampId) 
                params.append('origin_camp_id', filters.originCampId.toString());
            if (filters?.destinationCampId) 
                params.append('destination_camp_id', filters.destinationCampId.toString());
            if (filters?.requestType) 
                params.append('request_type', filters.requestType);
            if (filters?.status) 
                params.append('status', filters.status);
            if (filters?.originApprovalStatus) 
                params.append('origin_approval_status', filters.originApprovalStatus);
            if (filters?.destinationApprovalStatus) 
                params.append('destination_approval_status', filters.destinationApprovalStatus);

            const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>( `/camp-requests?${params.toString()}` );
            
            const items = this.extractItems<unknown>(data);
            return items.map((item) => this.normalizeCampRequest(item));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    /**
     * Obtener solicitud por ID
     */
    async getCampRequestById(id: number): Promise<CampRequestFormValues> {
        try {
            const { data } = await this.client.get<BackendResponse<{ item: unknown }> | unknown>( `/camp-requests/${id}` );
            
            return this.normalizeCampRequest(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    /**
     * Crear nueva solicitud
     */
    async createCampRequest(payload: Partial<CampRequestFormValues>): Promise<CampRequestFormValues> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: unknown }> | unknown>( "/camp-requests", this.toWritePayload(payload) );
            
            return this.normalizeCampRequest(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    /**
     * Aprobar solicitud como destino
     */
    async approveAsDestination(id: number, userId: number): Promise<CampRequestFormValues> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: unknown }> | unknown>( `/camp-requests/${id}/approve-destination`, { approved_by_destination_user_id: userId } );
            
            return this.normalizeCampRequest(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    /**
     * Rechazar solicitud como destino
     */
    async rejectAsDestination(id: number, userId: number): Promise<CampRequestFormValues> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: unknown }> | unknown>( `/camp-requests/${id}/reject-destination`, { approved_by_destination_user_id: userId } );
            
            return this.normalizeCampRequest(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    /**
     * Aprobar solicitud como origen
     */
    async approveAsOrigin(id: number, userId: number): Promise<CampRequestFormValues> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: unknown }> | unknown>( `/camp-requests/${id}/approve-origin`, { approved_by_origin_user_id: userId } );
            
            return this.normalizeCampRequest(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    /**
     * Rechazar solicitud como origen
     */
    async rejectAsOrigin(id: number, userId: number): Promise<CampRequestFormValues> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: unknown }> | unknown>( `/camp-requests/${id}/reject-origin`, { approved_by_origin_user_id: userId } );
            
            return this.normalizeCampRequest(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    private normalizeCampRequest(input: unknown): CampRequestFormValues {
        const source = (input ?? {}) as Record<string, unknown>;
        return campRequestSchema.parse({
            id: source.id ?? null,
            origin_camp_id: source.origin_camp_id ?? 0,
            destination_camp_id: source.destination_camp_id ?? 0,
            request_type: source.request_type ?? 'R',
            status: source.status ?? 'P',
            origin_approval_status: source.origin_approval_status ?? null,
            destination_approval_status: source.destination_approval_status ?? null,
            approved_by_origin_user_id: source.approved_by_origin_user_id ?? null,
            approved_by_destination_user_id: source.approved_by_destination_user_id ?? null,
            approved_at: source.approved_at ?? null,
            description: source.description ?? null,
            created_at: source.created_at ?? null,
            resolved_at: source.resolved_at ?? null,
        });
    }

    private toWritePayload(payload: Partial<CampRequestFormValues>) {
        return {
            origin_camp_id: payload.origin_camp_id,
            destination_camp_id: payload.destination_camp_id,
            request_type: payload.request_type,
            status: payload.status,
            origin_approval_status: payload.origin_approval_status,
            destination_approval_status: payload.destination_approval_status,
            description: payload.description?.trim() || undefined,
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

export const campRequestService = new CampRequestService();
