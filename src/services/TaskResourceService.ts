import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../shared/utils/Response";
import { TaskResource, type CreateTaskResource } from "../models/TaskResource";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class TaskResourceService extends AxiosBaseService {

	async save(register: CreateTaskResource): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: TaskResource }> | TaskResource>(
				"/task-resources",
				register
			);
			const taskResource = this.extractItem<TaskResource>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", taskResource);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
	}

	async update(id: number, register: TaskResource): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: TaskResource }> | TaskResource>(
				`/task-resources/${id}`,
				register
			);
			const taskResource = this.extractItem<TaskResource>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", taskResource);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/task-resources/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<TaskResource>> | TaskResource[]>(
				"/task-resources"
			);
			const taskResources = this.extractItems<TaskResource>(data).map(
				(taskResource) => new TaskResource(taskResource)
			);

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", taskResources);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: TaskResource }> | TaskResource>(
				`/task-resources/${id}`
			);
			const taskResourceData = this.extractItem<TaskResource>(data);
			const taskResource = taskResourceData ? new TaskResource(taskResourceData) : null;

			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", taskResource);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}
}
