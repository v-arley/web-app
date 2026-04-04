import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { UserRol } from "../models/UserRol";

export class UserRoleService {
    private request: Request;

    constructor() {
        this.request = new Request();
    }

    async save(register: UserRol): Promise<Respuesta> {
        const request = new Request("/user-roles");
        await request.post(register);

        const data = request.readEntity<UserRol>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: UserRol): Promise<Respuesta> {
        const request = new Request("/user-roles", "{id}", { id });
        await request.put(register);

        const data = request.readEntity<UserRol>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/user-roles", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/user-roles");
        await request.get();

        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }

        const userRoles = (data?.resultado?.items ?? []).map((userRol) => new UserRol(userRol));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", userRoles);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/user-roles", "{id}", { id });
        await request.get();

        const data = request.readEntity<BackendResponse<{ item: UserRol }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }

        const userRoles = data?.resultado?.item ? new UserRol(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", userRoles);
    }
}