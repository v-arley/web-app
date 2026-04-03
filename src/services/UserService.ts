import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { UserResponseDto, type CreateUserDto, type UpdateUserDto } from "../models/User";

export class UserService {

    async save(register: CreateUserDto): Promise<Respuesta> {
        const request = new Request("/users");
        await request.post(register);

        const data = request.readEntity<UserResponseDto>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: UpdateUserDto): Promise<Respuesta> {
        const request = new Request("/users", "{id}", { id });
        await request.put(register);

        const data = request.readEntity<UserResponseDto>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/users", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/users");
        request.setBearerToken(localStorage.getItem("token") ?? "");
        await request.get();

        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }

        const users = (data?.resultado?.items ?? []).map((u) => new UserResponseDto(u));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", users);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/users", "{id}", { id });
        request.setBearerToken(localStorage.getItem("token") ?? "");
        await request.get();

        const data = request.readEntity<BackendResponse<{ item: UserResponseDto }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }

        const user = data?.resultado?.item ? new UserResponseDto(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", user);
    }
}

