import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { TaskResource } from "../models/TaskResource";

export class TaskResourceService {
    private request: Request;

    constructor() {
        this.request = new Request();
    }

    async save(register: TaskResource): Promise<Respuesta> {
        const request = new Request("/task-resources");
        await request.post(register);

        const data = request.readEntity<TaskResource>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: TaskResource): Promise<Respuesta> {
        const request = new Request("/task-resources", "{id}", { id });
        await request.put(register);

        const data = request.readEntity<TaskResource>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/task-resources", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/task-resources");
        await request.get();

        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }

        const taskResources = (data?.resultado?.items ?? []).map((taskResource) => new TaskResource(taskResource));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", taskResources);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/task-resources", "{id}", { id });
        await request.get();

        const data = request.readEntity<BackendResponse<{ item: TaskResource }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }

        const taskResources = data?.resultado?.item ? new TaskResource(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", taskResources);
    }
}
