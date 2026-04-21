import { Response as Respuesta, type BackendListPayload, type BackendResponse } from "../utils/Response";
import { CampRequest, type CreateCampRequest} from "../models/CampRequest";
import { AxiosBaseService } from "./AxiosBaseService";

export class CampRequestService extends AxiosBaseService {

    async save(register: CreateCampRequest): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: CampRequest }> | CampRequest>("/camp-requests", register);
            const campRequest = this.extractItem<CampRequest>(data);

            return new Respuesta(true, "Registro creado correctamente.", "", "registro", campRequest);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
        }
    }

    async update(id: number, register: CampRequest): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: CampRequest }> | CampRequest>(`/camp-requests/${id}`, register);
            const campRequest = this.extractItem<CampRequest>(data);

            return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", campRequest);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
        }
    }

    async remove(id: number): Promise<Respuesta> {
        try {
            await this.client.delete(`/camp-requests/${id}`);

            return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<CampRequest>> | CampRequest[]>("/camp-requests");
            const campRequests = this.extractItems<CampRequest>(data).map((item) => new CampRequest(item));

            return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", campRequests);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
        }
    }

    async findById(id: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<{ item: CampRequest }> | CampRequest>(`/camp-requests/${id}`);
            const campRequestData = this.extractItem<CampRequest>(data);
            const campRequest = campRequestData ? new CampRequest(campRequestData) : null;

            return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", campRequest);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
        }
    }
}