import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { Permission, type CreatePermission, type UpdatePermission } from "../models/Permision";

export class PermissionService {
    private request: Request;

    constructor() {
        this.request = new Request();
    }

    async save(register: Permission): Promise<Respuesta> {
        const request = new Request("/permissions");
        await request.post(register);
    
        const data = request.readEntity<Permission>();
    
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: Permission): Promise<Respuesta> {
        const request = new Request("/permissions", "{id}", { id });
        await request.put(register);
    
        const data = request.readEntity<Permission>();
    
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }
    
        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/permissions", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/permissions");
        await request.get();
    
        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }
    
        const permissions = (data?.resultado?.items ?? []).map((permission) => new Permission(permission));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", permissions);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/permissions", "{id}", { id });
        await request.get();
    
        const data = request.readEntity<BackendResponse<{ item: Permission }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }
    
        const permissions = data?.resultado?.item ? new Permission(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", permissions);
    }
}