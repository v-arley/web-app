import { AxiosBaseService } from "../../../../services/AxiosBaseService";
import type { BackendResponse } from "../../../../utils/Response";
import { rationExecutionResultSchema, type RationExecutionFormValues, type RationExecutionResult } from "../schemas/ration-execution.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aún no existe o el contrato no es válido.";

export class RationExecutionService extends AxiosBaseService {
    /**
     * Ejecuta la generación de raciones diarias para un campamento
     * Paso 1: Verificar si ya existen raciones para la fecha
     * Paso 2: Crear raciones para cada persona activa
     * Paso 3: Asignar recursos según configuración
     * Paso 4: Descontar del inventario
     * Paso 5: Verificar alertas
     * Paso 6: Retornar resultado
     */
    async executeRationGeneration(payload: RationExecutionFormValues): Promise<RationExecutionResult> {
        try {
            const { data } = await this.client.post<BackendResponse<{ result: unknown }> | unknown>( "/rations/execute", this.toWritePayload(payload) );
            
            return this.normalizeResult(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    /**
     * Verifica si ya existen raciones para una fecha específica
     */
    async checkExistingRations(campId: number, rationDate: string): Promise<{ exists: boolean; count: number }> {
        try {
            const { data } = await this.client.get<BackendResponse<{ exists: boolean; count: number }> | unknown>( `/rations/check?camp_id=${campId}&ration_date=${rationDate}` );
            
            // TODO: verificar el origen del error y mitigarlo adecuadamente sin corromper la funcionalidad
            const result = this.extractItem<{ exists: boolean; count: number }>(data);
            return {
                exists: result.exists ?? false,
                count: result.count ?? 0,
            };
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    /**
     * Obtiene una vista previa de las raciones que se generarían
     */
    async previewRationGeneration(campId: number, rationDate: string): Promise<{ total_persons: number; persons: Array<{ id: number; name: string }>; resources_needed: Array<{ resource_id: number; total_amount: number }>; }> {
        try {
            const { data } = await this.client.get<BackendResponse<unknown> | unknown>( `/rations/preview?camp_id=${campId}&ration_date=${rationDate}` );
            
            // TODO: verificar el origen del error y mitigarlo adecuadamente sin corromper la funcionalidad
            const result = this.extractItem<unknown>(data) as any;
            return {
                total_persons: result.total_persons ?? 0,
                persons: result.persons ?? [],
                resources_needed: result.resources_needed ?? [],
            };
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    private normalizeResult(input: unknown): RationExecutionResult {
        const source = (input ?? {}) as Record<string, unknown>;
        return rationExecutionResultSchema.parse({
            success: source.success ?? false,
            total_rations: source.total_rations ?? 0,
            total_resources_assigned: source.total_resources_assigned ?? 0,
            total_errors: source.total_errors ?? 0,
            insufficient_stock: source.insufficient_stock ?? [],
            errors: source.errors ?? [],
            rations_created: source.rations_created ?? undefined,
        });
    }

    private toWritePayload(payload: RationExecutionFormValues) {
        return {
            camp_id: payload.camp_id,
            ration_date: payload.ration_date,
            resource_config: payload.resource_config,
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

export const rationExecutionService = new RationExecutionService();
