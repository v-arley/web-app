import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { Exploration, type CreateExploration, type UpdateExploration } from "../models/Exploration";
import { AxiosBaseService } from "./AxiosBaseService";

export class ExplorationService extends AxiosBaseService {
	async save(register: CreateExploration): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: Exploration }> | Exploration>("/explorations", register);
			const exploration = this.extractItem<Exploration>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", exploration);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
	}

	async update(id: number, register: UpdateExploration): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: Exploration }> | Exploration>(`/explorations/${id}`, register);
			const exploration = this.extractItem<Exploration>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", exploration);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/explorations/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<Exploration>> | Exploration[]>("/explorations");
			const explorations = this.extractItems<Exploration>(data).map((exploration) => new Exploration(exploration));

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", explorations);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: Exploration }> | Exploration>(`/explorations/${id}`);
			const explorationData = this.extractItem<Exploration>(data);
			const exploration = explorationData ? new Exploration(explorationData) : null;

			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", exploration);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}
}