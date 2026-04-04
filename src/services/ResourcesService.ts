import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { Resource, type CreateResource, type UpdateResource } from "../models/Resource";

export class ResouceService {
    private request: Request;

    constructor() {
        this.request = new Request();
    }

    async save(register: Resource): Promise<Respuesta> {
        const request = new Request("/resources");
        await request.post(register);
    
        const data = request.readEntity<Resource>();
    
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: Resource): Promise<Respuesta> {
        const request = new Request("/resources", "{id}", { id });
        await request.put(register);
    
        const data = request.readEntity<Resource>();
    
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }
    
        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/resources", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/resources");
        await request.get();
    
        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }
    
        const resources = (data?.resultado?.items ?? []).map((resource) => new Resource(resource));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", resources);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/resources", "{id}", { id });
        await request.get();
    
        const data = request.readEntity<BackendResponse<{ item: Resource }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }
    
        const resources = data?.resultado?.item ? new Resource(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", resources);
    }
}