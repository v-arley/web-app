import {
  Response as Respuesta,
  type BackendResponse,
  type BackendListPayload,
} from "../shared/utils/Response";
import {
  Task,
  type CreateTask,
  type UpdateTask,
  type WorkerTaskCompleteResponse,
} from "../models/Task";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class TaskService extends AxiosBaseService {
  private toBackendPayload(register: CreateTask | UpdateTask) {
    const estimatedMinutes =
      register.estimated_minutes ??
      register.estimatedMinutes ??
      (register.estimated_hours !== undefined
        ? Number(register.estimated_hours) * 60
        : undefined);

    return {
      camp_id: register.camp_id ?? register.campId,
      name: register.name ?? register.title,
      description: register.description,
      type: register.type,
      priority: register.priority,
      difficulty: register.difficulty,
      estimated_minutes: Number.isNaN(estimatedMinutes)
        ? undefined
        : estimatedMinutes,
    };
  }

  async save(register: CreateTask): Promise<Respuesta> {
    try {
      const payload = this.toBackendPayload(register);

      const { data } = await this.client.post<
        BackendResponse<{ item: Task }> | Task
      >("/tasks", payload);

      const taskData = this.extractItem<Task>(data);
      const task = taskData ? new Task(taskData) : null;

      return new Respuesta(
        true,
        "Registro creado correctamente.",
        "",
        "registro",
        task,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(error, "No se pudo crear el registro"),
        "",
        "registro",
        null,
      );
    }
  }

  async update(id: number, register: UpdateTask): Promise<Respuesta> {
    try {
      const payload = this.toBackendPayload(register);

      const { data } = await this.client.put<
        BackendResponse<{ item: Task }> | Task
      >(`/tasks/${id}`, payload);

      const taskData = this.extractItem<Task>(data);
      const task = taskData ? new Task(taskData) : null;

      return new Respuesta(
        true,
        "Registro actualizado correctamente.",
        "",
        "registro",
        task,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(error, "No se pudo actualizar el registro"),
        "",
        "registro",
        null,
      );
    }
  }

  async remove(id: number): Promise<Respuesta> {
    try {
      await this.client.delete(`/tasks/${id}`);

      return new Respuesta(
        true,
        "Registro eliminado correctamente.",
        "",
        "registro",
        null,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(error, "No se pudo eliminar el registro"),
        "",
        "registro",
        null,
      );
    }
  }

  async findAll(): Promise<Respuesta> {
    try {
      const { data } = await this.client.get<
        BackendResponse<BackendListPayload<Task>> | Task[]
      >("/tasks");

      const tasks = this.extractItems<Task>(data).map((task) => new Task(task));

      return new Respuesta(
        true,
        "Registros obtenidos correctamente.",
        "",
        "registros",
        tasks,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(error, "No se pudieron obtener los registros"),
        "",
      );
    }
  }

  async findById(id: number): Promise<Respuesta> {
    try {
      const { data } = await this.client.get<
        BackendResponse<{ item: Task }> | Task
      >(`/tasks/${id}`);

      const taskData = this.extractItem<Task>(data);
      const task = taskData ? new Task(taskData) : null;

      return new Respuesta(
        true,
        "Registro obtenido correctamente.",
        "",
        "registro",
        task,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(error, "No se pudo obtener el registro"),
        "",
        "registro",
        null,
      );
    }
  }

  async findWorkerTasks(): Promise<Respuesta> {
    try {
      const { data } = await this.client.get<
        BackendResponse<BackendListPayload<Task>> | Task[]
      >("/tasks/worker");

      const tasks = this.extractItems<Task>(data).map((task) => new Task(task));

      return new Respuesta(
        true,
        "Tareas del trabajador obtenidas correctamente.",
        "",
        "registros",
        tasks,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(
          error,
          "No se pudieron obtener las tareas del trabajador",
        ),
        "",
        "registros",
        [],
      );
    }
  }

  async completeWorkerTask(taskId: number): Promise<Respuesta> {
    try {
      const { data } = await this.client.patch<
        | BackendResponse<{ item: WorkerTaskCompleteResponse }>
        | WorkerTaskCompleteResponse
      >(`/tasks/worker/${taskId}/complete`, {});

      const result = this.extractItem<WorkerTaskCompleteResponse>(data);

      return new Respuesta(
        true,
        result?.alreadyCompleted
          ? "La tarea ya estaba completada."
          : "Tarea completada correctamente.",
        "",
        "registro",
        result,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(
          error,
          "No se pudo completar la tarea del trabajador",
        ),
        "",
        "registro",
        null,
      );
    }
  }
}

