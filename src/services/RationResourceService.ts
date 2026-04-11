import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { RationResource, type CreateRationResource } from "../models/RationResource";
import { AxiosBaseService } from "./AxiosBaseService";

export class RationResourceService extends AxiosBaseService {

	async save(register: CreateRationResource): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: RationResource }> | RationResource>("/ration-resources", register);
			const rationResource = this.extractItem<RationResource>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", rationResource);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
		
	}

	async update(id: number, register: RationResource): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: RationResource }> | RationResource>(`/ration-resources/${id}`, register);
			const rationResource = this.extractItem<RationResource>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", rationResource);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/ration-resources/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<RationResource>> | RationResource[]>("/ration-resources");
			const rationResources = this.extractItems<RationResource>(data).map(
				(rationResource) => new RationResource(rationResource)
			);

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", rationResources);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: RationResource }> | RationResource>(`/ration-resources/${id}`);
			const rationResourceData = this.extractItem<RationResource>(data);
			const rationResource = rationResourceData ? new RationResource(rationResourceData) : null;

			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", rationResource);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}
}