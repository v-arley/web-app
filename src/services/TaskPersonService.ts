import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { TaskPerson, type CreateTaskPerson } from "../models/TaskPerson";

export class TaskPersonService {
    private request: Request;

    constructor() {
        this.request = new Request();
    }

    async save(register: TaskPerson): Promise<Respuesta> {
        const request = new Request("/task-assignments");
        await request.post(register);
    
        const data = request.readEntity<TaskPerson>();
    
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: TaskPerson): Promise<Respuesta> {
        const request = new Request("/task-assignments", "{id}", { id });
        await request.put(register);
    
        const data = request.readEntity<TaskPerson>();
    
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }
    
        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/task-assignments", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/task-assignments");
        await request.get();
    
        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }
    
        const taskAssignments = (data?.resultado?.items ?? []).map((taskPerson) => new TaskPerson(taskPerson));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", taskAssignments);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/task-assignments", "{id}", { id });
        await request.get();
    
        const data = request.readEntity<BackendResponse<{ item: TaskPerson }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }
    
        const taskAssignments = data?.resultado?.item ? new TaskPerson(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", taskAssignments);
    }
}