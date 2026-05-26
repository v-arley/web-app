import { Response as Respuesta, type BackendListPayload, type BackendResponse } from "../shared/utils/Response";
import { AiDecision, type CreateAiDecision, type UpdateAiDecision } from "../models/AiDecision";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class AiDecisionService extends AxiosBaseService {

    async save(register: CreateAiDecision): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: AiDecision }> | AiDecision>("/ai-decisions", register);
            const aiDecision = this.extractItem<AiDecision>(data);

            return new Respuesta(true, "Registro creado correctamente.", "", "registro", aiDecision);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
        }
    }

    async update(id: number, register: UpdateAiDecision): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: AiDecision }> | AiDecision>(`/ai-decisions/${id}`, register);
            const aiDecision = this.extractItem<AiDecision>(data);

            return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", aiDecision);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
        }
    }

    async remove(id: number): Promise<Respuesta> {
        try {
            await this.client.delete(`/ai-decisions/${id}`);

            return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<AiDecision>> | AiDecision[]>("/ai-decisions");
            const aiDecisions = this.extractItems<AiDecision>(data).map((item) => new AiDecision(item));

            return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", aiDecisions);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
        }
    }

    async findById(id: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<{ item: AiDecision }> | AiDecision>(`/ai-decisions/${id}`);
            const aiDecisionData = this.extractItem<AiDecision>(data);
            const aiDecision = aiDecisionData ? new AiDecision(aiDecisionData) : null;

            return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", aiDecision);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
        }
    }
}
