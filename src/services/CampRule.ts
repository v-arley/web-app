import { Response as Respuesta, type BackendListPayload, type BackendResponse } from "../shared/utils/Response";
import { CampRule, type CreateCampRule } from "../models/CampRule";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class CampRuleService extends AxiosBaseService {

    async save(register: CreateCampRule): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: CampRule }> | CampRule>("/camp-rules", register);
            const campRule = this.extractItem<CampRule>(data);

            return new Respuesta(true, "Registro creado correctamente.", "", "registro", campRule);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
        }
    }

    async update(id: number, register: CampRule): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: CampRule }> | CampRule>(`/camp-rules/${id}`, register);
            const campRule = this.extractItem<CampRule>(data);

            return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", campRule);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
        }
    }

    async remove(id: number): Promise<Respuesta> {
        try {
            await this.client.delete(`/camp-rules/${id}`);

            return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<CampRule>> | CampRule[]>("/camp-rules");
            const campRules = this.extractItems<CampRule>(data).map((item) => new CampRule(item));

            return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", campRules);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
        }
    }

    async findById(id: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<{ item: CampRule }> | CampRule>(`/camp-rules/${id}`);
            const campRuleData = this.extractItem<CampRule>(data);
            const campRule = campRuleData ? new CampRule(campRuleData) : null;

            return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", campRule);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
        }
    }
}
