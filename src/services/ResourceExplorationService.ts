import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { ExplorationResource, type CreateExplorationResource } from "../models/ExplorationResource";
import { AxiosBaseService } from "./AxiosBaseService";

export class ResourceExplorationService extends AxiosBaseService {

	async save(register: CreateExplorationResource): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: ExplorationResource }> | ExplorationResource>("/exploration-resources", register);
			const explorationResource = this.extractItem<ExplorationResource>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", explorationResource);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
	}

	async update(id: number, register: ExplorationResource): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: ExplorationResource }> | ExplorationResource>(`/exploration-resources/${id}`, register);
			const explorationResource = this.extractItem<ExplorationResource>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", explorationResource);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/exploration-resources/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<ExplorationResource>> | ExplorationResource[]>("/exploration-resources");
			const explorationResources = this.extractItems<ExplorationResource>(data).map(
				(explorationResource) => new ExplorationResource(explorationResource)
			);

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", explorationResources);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: ExplorationResource }> | ExplorationResource>(`/exploration-resources/${id}`);
			const explorationResourceData = this.extractItem<ExplorationResource>(data);
			const explorationResource = explorationResourceData ? new ExplorationResource(explorationResourceData) : null;

			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", explorationResource);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}
}