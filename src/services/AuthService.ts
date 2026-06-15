import { Request } from "../shared/utils/Request";
import type { AuthContext } from "../shared/utils/authAccess";
import { normalizeRoles, toOptionalNumber } from "../shared/utils/authAccess";

type MeResponse = {
    userId: number | string;
    username: string;
    roles: string[];
    campId?: number | string | null;
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
        // Recuperamos el perfil completo del usuario via /auth/me,
        // única fuente de verdad para roles y profesión.
        const user = await this.me();
        if (!user) {
            throw new Error("No se pudo obtener el perfil del usuario tras iniciar sesión");
        }
        return user;
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

    async refreshSession(): Promise<void> {
        const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
        const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: "{}",
        });

        if (!response.ok) {
            throw new Error("No se pudo renovar la sesión");
        }
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
            userId: toOptionalNumber(data?.userId),
            roles: normalizeRoles(data?.roles),
            campId: toOptionalNumber(data?.campId),
            profession: data?.profession,
        };
    }
}


