import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { PermissionRol, type CreatePermissionRol } from "../models/PermissionRol";

export class RolePermissionService {
    private request: Request;

    constructor() {
        this.request = new Request();
    }

    async save(register: PermissionRol): Promise<Respuesta> {
        const request = new Request("/role-permissions");
        await request.post(register);
    
        const data = request.readEntity<PermissionRol>();
    
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: PermissionRol): Promise<Respuesta> {
        const request = new Request("/role-permissions", "{id}", { id });
        await request.put(register);
    
        const data = request.readEntity<PermissionRol>();
    
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }
    
        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/role-permissions", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/role-permissions");
        await request.get();
    
        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }
    
        const rolePermissions = (data?.resultado?.items ?? []).map((permissionRol) => new PermissionRol(permissionRol));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", rolePermissions);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/role-permissions", "{id}", { id });
        await request.get();
    
        const data = request.readEntity<BackendResponse<{ item: PermissionRol }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }
    
        const rolePermissions = data?.resultado?.item ? new PermissionRol(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", rolePermissions);
    }
}