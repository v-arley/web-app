import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { PersonExploration, type CreatePersonExploration } from "../models/PersonExploration";
import { AxiosBaseService } from "./AxiosBaseService";

export class PersonExplorationService extends AxiosBaseService {

	async save(register: CreatePersonExploration): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: PersonExploration }> | PersonExploration>("/person-explorations", register);
			const personExploration = this.extractItem<PersonExploration>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", personExploration);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
	}

	async update(id: number, register: PersonExploration): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: PersonExploration }> | PersonExploration>(`/person-explorations/${id}`, register);
			const personExploration = this.extractItem<PersonExploration>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", personExploration);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/person-explorations/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<PersonExploration>> | PersonExploration[]>("/person-explorations");
			const personExplorations = this.extractItems<PersonExploration>(data).map(
				(personExploration) => new PersonExploration(personExploration)
			);

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", personExplorations);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: PersonExploration }> | PersonExploration>(`/person-explorations/${id}`);
			const personExplorationData = this.extractItem<PersonExploration>(data);
			const personExploration = personExplorationData ? new PersonExploration(personExplorationData) : null;

			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", personExploration);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}
}