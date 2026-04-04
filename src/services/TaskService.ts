import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { Task, type CreateTask, type UpdateTask } from "../models/Task";

export class TaskService {
    private request: Request;

    constructor() {
        this.request = new Request();
    }

    async save(register: Task): Promise<Respuesta> {
        const request = new Request("/tasks");
        await request.post(register);
    
        const data = request.readEntity<Task>();
    
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: Task): Promise<Respuesta> {
        const request = new Request("/tasks", "{id}", { id });
        await request.put(register);
    
        const data = request.readEntity<Task>();
    
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }
    
        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/tasks", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/tasks");
        await request.get();
    
        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }
    
        const tasks = (data?.resultado?.items ?? []).map((task) => new Task(task));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", tasks);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/tasks", "{id}", { id });
        await request.get();
    
        const data = request.readEntity<BackendResponse<{ item: Task }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }
    
        const tasks = data?.resultado?.item ? new Task(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", tasks);
    }
}