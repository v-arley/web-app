import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { Resource, type CreateResource, type UpdateResource } from "../models/Resource";
import { AxiosBaseService } from "./AxiosBaseService";

export class ResourceService extends AxiosBaseService {

	async save(register: CreateResource): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: Resource }> | Resource>("/resources", register);
			const resource = this.extractItem<Resource>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", resource);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
	}

	async update(id: number, register: UpdateResource): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: Resource }> | Resource>(`/resources/${id}`, register);
			const resource = this.extractItem<Resource>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", resource);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/resources/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<Resource>> | Resource[]>("/resources");
			const resources = this.extractItems<Resource>(data).map((resource) => new Resource(resource));

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", resources);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: Resource }> | Resource>(`/resources/${id}`);
			const resourceData = this.extractItem<Resource>(data);
			const resource = resourceData ? new Resource(resourceData) : null;

			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", resource);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}
}