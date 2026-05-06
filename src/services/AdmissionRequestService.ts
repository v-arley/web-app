import { Response as Respuesta, type BackendListPayload, type BackendResponse } from "../utils/Response";
import { AdmissionRequest, type CreateAdmissionRequest, type UpdateAdmissionRequest } from "../models/AdmissionRequest";
import { AxiosBaseService } from "./AxiosBaseService";

export class AdmissionRequestService extends AxiosBaseService {
    async save(register: CreateAdmissionRequest): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: AdmissionRequest }> | AdmissionRequest>("/admission-requests", register);
            const admissionRequest = this.extractItem<AdmissionRequest>(data);

            return new Respuesta(true, "Registro creado correctamente.", "", "registro", admissionRequest);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
        }
    }

    async update(id: number, register: UpdateAdmissionRequest): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: AdmissionRequest }> | AdmissionRequest>(`/admission-requests/${id}`, register);
            const admissionRequest = this.extractItem<AdmissionRequest>(data);

            return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", admissionRequest);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
        }
    }

    async remove(id: number): Promise<Respuesta> {
        try {
            await this.client.delete(`/admission-requests/${id}`);

            return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<AdmissionRequest>> | AdmissionRequest[]>("/admission-requests");
            const admissionRequests = this.extractItems<AdmissionRequest>(data).map((item) => new AdmissionRequest(item));

            return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", admissionRequests);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
        }
    }

    async findById(id: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<{ item: AdmissionRequest }> | AdmissionRequest>(`/admission-requests/${id}`);
            const admissionRequestData = this.extractItem<AdmissionRequest>(data);
            const admissionRequest = admissionRequestData ? new AdmissionRequest(admissionRequestData) : null;

            return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", admissionRequest);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
        }
    }
}
