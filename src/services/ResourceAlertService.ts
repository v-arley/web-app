import { Response as Respuesta, type BackendListPayload, type BackendResponse } from "../shared/utils/Response";
import { ResourceAlert, type CreateResourceAlert } from "../models/ResourceAlert";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class ResourceAlertService extends AxiosBaseService {

    async save(register: CreateResourceAlert): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: ResourceAlert }> | ResourceAlert>("/resource-alerts", register);
            const resourceAlert = this.extractItem<ResourceAlert>(data);

            return new Respuesta(true, "Registro creado correctamente.", "", "registro", resourceAlert);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
        }
    }

    async update(id: number, register: ResourceAlert): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: ResourceAlert }> | ResourceAlert>(`/resource-alerts/${id}`, register);
            const resourceAlert = this.extractItem<ResourceAlert>(data);

            return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", resourceAlert);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
        }
    }

    async remove(id: number): Promise<Respuesta> {
        try {
            await this.client.delete(`/resource-alerts/${id}`);

            return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<ResourceAlert>> | ResourceAlert[]>("/resource-alerts");
            const resourceAlerts = this.extractItems<ResourceAlert>(data).map((item) => new ResourceAlert(item));

            return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", resourceAlerts);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
        }
    }

    async findById(id: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<{ item: ResourceAlert }> | ResourceAlert>(`/resource-alerts/${id}`);
            const resourceAlertData = this.extractItem<ResourceAlert>(data);
            const resourceAlert = resourceAlertData ? new ResourceAlert(resourceAlertData) : null;

            return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", resourceAlert);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
        }
    }
}
