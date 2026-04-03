import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse } from "../utils/Response";

export class AuthService {

    async login(username: string, password: string): Promise<Respuesta> {
        const request = new Request("/auth/login");
        await request.post({ username, password });

        const data = request.readEntity<BackendResponse<{ token: string }>>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "Credenciales inválidas", "");
        }

        const token = (data as Record<string, unknown>)?.token as string ?? null;
        return new Respuesta(true, "Login exitoso", "", "token", token);
    }

    async register(username: string, password: string): Promise<Respuesta> {
        const request = new Request("/auth/register");
        await request.post({ username, password });

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo registrar", "");
        }

        const data = request.readEntity<Record<string, unknown>>();
        return new Respuesta(true, "Registro exitoso", "", "usuario", data);
    }
}
