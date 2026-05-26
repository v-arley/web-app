import { Response as Respuesta, type BackendListPayload, type BackendResponse } from "../shared/utils/Response";
import { ResourceMovement, type CreateResourceMovement } from "../models/ResourceMovement";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class ResourceMovementService extends AxiosBaseService {

    async save(register: CreateResourceMovement): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: ResourceMovement }> | ResourceMovement>("/resource-movements", register);
            const resourceMovement = this.extractItem<ResourceMovement>(data);

            return new Respuesta(true, "Registro creado correctamente.", "", "registro", resourceMovement);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
        }
    }

    async update(id: number, register: ResourceMovement): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: ResourceMovement }> | ResourceMovement>(`/resource-movements/${id}`, register);
            const resourceMovement = this.extractItem<ResourceMovement>(data);

            return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", resourceMovement);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
        }
    }

    async remove(id: number): Promise<Respuesta> {
        try {
            await this.client.delete(`/resource-movements/${id}`);

            return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<ResourceMovement>> | ResourceMovement[]>("/resource-movements");
            const resourceMovements = this.extractItems<ResourceMovement>(data).map((item) => new ResourceMovement(item));

            return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", resourceMovements);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
        }
    }

    async findById(id: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<{ item: ResourceMovement }> | ResourceMovement>(`/resource-movements/${id}`);
            const resourceMovementData = this.extractItem<ResourceMovement>(data);
            const resourceMovement = resourceMovementData ? new ResourceMovement(resourceMovementData) : null;

            return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", resourceMovement);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
        }
    }

    async findByResource(resourceId: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<ResourceMovement>> | ResourceMovement[]>(`/resource-movements?resource_id=${resourceId}`);
            const resourceMovements = this.extractItems<ResourceMovement>(data).map((item) => new ResourceMovement(item));

            return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", resourceMovements);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
        }
    }
}
