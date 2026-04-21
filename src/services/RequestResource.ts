import { Response as Respuesta, type BackendListPayload, type BackendResponse } from "../utils/Response";
import { RequestResource, type CreateRequestResource } from "../models/RequestResource";
import { AxiosBaseService } from "./AxiosBaseService";

export class RequestResourceService extends AxiosBaseService {

    async save(register: CreateRequestResource): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: RequestResource }> | RequestResource>("/request-resources", register);
            const requestResource = this.extractItem<RequestResource>(data);

            return new Respuesta(true, "Registro creado correctamente.", "", "registro", requestResource);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
        }
    }

    async update(id: number, register: RequestResource): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: RequestResource }> | RequestResource>(`/request-resources/${id}`, register);
            const requestResource = this.extractItem<RequestResource>(data);

            return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", requestResource);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
        }
    }

    async remove(id: number): Promise<Respuesta> {
        try {
            await this.client.delete(`/request-resources/${id}`);

            return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<RequestResource>> | RequestResource[]>("/request-resources");
            const requestResources = this.extractItems<RequestResource>(data).map((item) => new RequestResource(item));

            return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", requestResources);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
        }
    }

    async findById(id: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<{ item: RequestResource }> | RequestResource>(`/request-resources/${id}`);
            const requestResourceData = this.extractItem<RequestResource>(data);
            const requestResource = requestResourceData ? new RequestResource(requestResourceData) : null;

            return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", requestResource);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
        }
    }
}