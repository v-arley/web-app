import { Response as Respuesta, type BackendListPayload, type BackendResponse } from "../utils/Response";
import { AiPrompt, type CreateAiPrompt, type UpdateAiPrompt } from "../models/AiPrompt";
import { AxiosBaseService } from "./AxiosBaseService";

export class AiPromptService extends AxiosBaseService {

    async save(register: CreateAiPrompt): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: AiPrompt }> | AiPrompt>("/ai-prompts", register);
            const aiPrompt = this.extractItem<AiPrompt>(data);

            return new Respuesta(true, "Registro creado correctamente.", "", "registro", aiPrompt);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
        }
    }

    async update(id: number, register: UpdateAiPrompt): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: AiPrompt }> | AiPrompt>(`/ai-prompts/${id}`, register);
            const aiPrompt = this.extractItem<AiPrompt>(data);

            return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", aiPrompt);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
        }
    }

    async remove(id: number): Promise<Respuesta> {
        try {
            await this.client.delete(`/ai-prompts/${id}`);

            return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<AiPrompt>> | AiPrompt[]>("/ai-prompts");
            const aiPrompts = this.extractItems<AiPrompt>(data).map((item) => new AiPrompt(item));

            return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", aiPrompts);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
        }
    }

    async findById(id: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<{ item: AiPrompt }> | AiPrompt>(`/ai-prompts/${id}`);
            const aiPromptData = this.extractItem<AiPrompt>(data);
            const aiPrompt = aiPromptData ? new AiPrompt(aiPromptData) : null;

            return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", aiPrompt);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
        }
    }
}