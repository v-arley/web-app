import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../shared/utils/Response";
import { TaskPerson, type CreateTaskPerson } from "../models/TaskPerson";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class TaskPersonService extends AxiosBaseService {

	async save(register: CreateTaskPerson): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: TaskPerson }> | TaskPerson>(
				"/task-assignments",
				register
			);
			const taskPerson = this.extractItem<TaskPerson>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", taskPerson);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
	}

	async update(id: number, register: TaskPerson): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: TaskPerson }> | TaskPerson>(
				`/task-assignments/${id}`,
				register
			);
			const taskPerson = this.extractItem<TaskPerson>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", taskPerson);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/task-assignments/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<TaskPerson>> | TaskPerson[]>(
				"/task-assignments"
			);
			const taskAssignments = this.extractItems<TaskPerson>(data).map(
				(taskPerson) => new TaskPerson(taskPerson)
			);

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", taskAssignments);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: TaskPerson }> | TaskPerson>(
				`/task-assignments/${id}`
			);
			const taskPersonData = this.extractItem<TaskPerson>(data);
			const taskPerson = taskPersonData ? new TaskPerson(taskPersonData) : null;

			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", taskPerson);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}
}
