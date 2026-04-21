import { Response as Respuesta, type BackendListPayload, type BackendResponse } from "../utils/Response";
import { RequestPerson, type CreateRequestPerson } from "../models/RequestPerson";
import { AxiosBaseService } from "./AxiosBaseService";

export class RequestPersonService extends AxiosBaseService {

    async save(register: CreateRequestPerson): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: RequestPerson }> | RequestPerson>("/request-persons", register);
            const requestPerson = this.extractItem<RequestPerson>(data);

            return new Respuesta(true, "Registro creado correctamente.", "", "registro", requestPerson);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
        }
    }

    async update(id: number, register: RequestPerson): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: RequestPerson }> | RequestPerson>(`/request-persons/${id}`, register);
            const requestPerson = this.extractItem<RequestPerson>(data);

            return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", requestPerson);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
        }
    }

    async remove(id: number): Promise<Respuesta> {
        try {
            await this.client.delete(`/request-persons/${id}`);

            return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<RequestPerson>> | RequestPerson[]>("/request-persons");
            const requestPersons = this.extractItems<RequestPerson>(data).map((item) => new RequestPerson(item));

            return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", requestPersons);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
        }
    }

    async findById(id: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<{ item: RequestPerson }> | RequestPerson>(`/request-persons/${id}`);
            const requestPersonData = this.extractItem<RequestPerson>(data);
            const requestPerson = requestPersonData ? new RequestPerson(requestPersonData) : null;

            return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", requestPerson);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
        }
    }
}