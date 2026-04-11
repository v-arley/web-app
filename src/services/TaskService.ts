import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { Task, type CreateTask, type UpdateTask } from "../models/Task";
import { AxiosBaseService } from "./AxiosBaseService";

export class TaskService extends AxiosBaseService {

	async save(register: CreateTask): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: Task }> | Task>(
				"/tasks",
				register
			);
			const task = this.extractItem<Task>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", task);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
	}

	async update(id: number, register: UpdateTask): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: Task }> | Task>(
				`/tasks/${id}`,
				register
			);
			const task = this.extractItem<Task>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", task);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/tasks/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<Task>> | Task[]>(
				"/tasks"
			);
			const tasks = this.extractItems<Task>(data).map(
				(task) => new Task(task)
			);

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", tasks);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: Task }> | Task>(
				`/tasks/${id}`
			);
			const taskData = this.extractItem<Task>(data);
			const task = taskData ? new Task(taskData) : null;

			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", task);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}
}