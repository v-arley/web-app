import { Request } from "../shared/utils/Request";
import type { AuthContext } from "../shared/utils/authAccess";
import { normalizeRoles } from "../shared/utils/authAccess";

type MeResponse = {
    userId: number;
    username: string;
    roles: string[];
    campId?: number;
    profession?: string;
};

export type RegisterUserPayload = {
    username: string;
    password: string;
    person_id?: number;
    profession?: string;
    state?: string;
};

export class AuthService {

    async login(username: string, password: string): Promise<AuthContext> {
        const request = new Request("/auth/login");
        await request.post({ username, password });

        if (request.isError()) {
            throw new Error(request.getError() ?? "Credenciales inválidas");
        }

        // El backend establece las cookies httpOnly automáticamente.
        // El cuerpo de la respuesta sólo contiene metadata no sensible del usuario.
        const data = request.readEntity<MeResponse>();
        return this.mapToAuthContext(data);
    }

    async me(): Promise<AuthContext | null> {
        const request = new Request("/auth/me");
        await request.get();

        if (request.isError()) {
            return null;
        }

        const data = request.readEntity<MeResponse>();
        if (!data) return null;
        return this.mapToAuthContext(data);
    }

    async logout(): Promise<void> {
        const request = new Request("/auth/logout");
        await request.post({});
        // El backend invalida la sesión y limpia las cookies httpOnly.
    }

    async register(usernameOrPayload: string | RegisterUserPayload, password?: string): Promise<void> {
        const request = new Request("/auth/register");
        const payload =
            typeof usernameOrPayload === "string"
                ? { username: usernameOrPayload, password: password ?? "" }
                : usernameOrPayload;

        await request.post(payload);

        if (request.isError()) {
            throw new Error(request.getError() ?? "No se pudo registrar");
        }
    }

    private mapToAuthContext(data: MeResponse | null): AuthContext {
        return {
            name: data?.username ?? "",
            userId: data?.userId,
            roles: normalizeRoles(data?.roles),
            campId: data?.campId,
            profession: data?.profession,
        };
    }
}


