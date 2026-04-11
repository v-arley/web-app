import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { Ration, type CreateRation, type UpdateRation } from "../models/Ration";
import { AxiosBaseService } from "./AxiosBaseService";

export class RationService extends AxiosBaseService {

	async save(register: CreateRation): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: Ration }> | Ration>("/rations", register);
			const ration = this.extractItem<Ration>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", ration);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
	}

	async update(id: number, register: UpdateRation): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: Ration }> | Ration>(`/rations/${id}`, register);
			const ration = this.extractItem<Ration>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", ration);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/rations/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<Ration>> | Ration[]>("/rations");
			const rations = this.extractItems<Ration>(data).map((ration) => new Ration(ration));

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", rations);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: Ration }> | Ration>(`/rations/${id}`);
			const rationData = this.extractItem<Ration>(data);
			const ration = rationData ? new Ration(rationData) : null;

			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", ration);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}
}