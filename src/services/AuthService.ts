import { Request } from "../shared/utils/Request";
import { Response as Respuesta, type BackendResponse } from "../shared/utils/Response";

export type RegisterUserPayload = {
    username: string;
    password: string;
    person_id?: number;
    profession?: string;
    state?: string;
};

export class AuthService {

    async login(username: string, password: string): Promise<Respuesta> {
        const request = new Request("/auth/login");
        await request.post({ username, password });

        const data = request.readEntity<BackendResponse<{ token: string }>>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "Credenciales invÃ¡lidas", "");
        }

        const token = (data as Record<string, unknown>)?.token as string ?? null;
        return new Respuesta(true, "Login exitoso", "", "token", token);
    }

    async register(usernameOrPayload: string | RegisterUserPayload, password?: string): Promise<Respuesta> {
        const request = new Request("/auth/register");
        const payload =
            typeof usernameOrPayload === "string"
                ? { username: usernameOrPayload, password: password ?? "" }
                : usernameOrPayload;

        await request.post(payload);

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo registrar", "");
        }

        const data = request.readEntity<Record<string, unknown>>();
        return new Respuesta(true, "Registro exitoso", "", "usuario", data);
    }
}

