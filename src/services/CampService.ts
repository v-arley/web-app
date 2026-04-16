import { Response as Respuesta, type BackendListPayload, type BackendResponse } from "../utils/Response";
import { Camp, type CreateCamp, type UpdateCamp } from "../models/Camp";
import { AxiosBaseService } from "./AxiosBaseService";

export class CampService extends AxiosBaseService{
    
    async save(register: CreateCamp): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: Camp }> | Camp>("/camps", register);
			const camp = this.extractItem<Camp>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", camp);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
	}

	async update(id: number, register: UpdateCamp): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: Camp }> | Camp>(`/camps/${id}`, register);
			const camp = this.extractItem<Camp>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", camp);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/camps/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<Camp>> | Camp[]>("/camps");
			const camps = this.extractItems<Camp>(data).map((camp) => new Camp(camp));

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", camps);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: Camp }> | Camp>(`/camps/${id}`);
			const campData = this.extractItem<Camp>(data);
			const camp = campData ? new Camp(campData) : null;

			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", camp);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}
}