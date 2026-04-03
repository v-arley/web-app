
type Primitive = string | number | boolean;

export class Request {
    private baseUrl: string;
    private url: string = "";
    private headers: Headers;
    private response: globalThis.Response | null = null;
    private responseData: unknown = null;
    private errorMessage: string | null = null;

    private static readonly AUTHENTICATION_SCHEME = "Bearer ";

    constructor(target?: string, parametros?: string, valores?: Record<string, Primitive>) {
        this.baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
        this.headers = new Headers({
            "Content-Type": "application/json; charset=UTF-8",
        });

        if (target) {
            if (parametros && valores) {
                this.setTargetWithParams(target, parametros, valores);
            } else {
                this.setTarget(target);
            }
        }
    }

    public setTarget(target: string): void {
        this.url = this.joinUrl(this.baseUrl, target);
    }

    public setTargetWithParams(target: string, parametros: string, valores: Record<string, Primitive>): void {
        const resolvedPath = parametros.replace(/\{(\w+)\}/g, (_, key: string) => {
            const value = valores[key];
            if (value === undefined || value === null) {
                throw new Error(`No se encontró valor para el parámetro: ${key}`);
            }
            return encodeURIComponent(String(value));
        });

        this.url = this.joinUrl(this.baseUrl, target, resolvedPath);
    }

    public setHeader(nombre: string, valor: string): void {
        this.headers.set(nombre, valor);
    }

    public setHeaders(valores: Record<string, string>): void {
        Object.entries(valores).forEach(([key, value]) => {
            this.headers.set(key, value);
        });

        if (!this.headers.has("Content-Type")) {
            this.headers.set("Content-Type", "application/json; charset=UTF-8");
        }
    }

    public setBearerToken(token: string): void {
        this.headers.set("Authorization", `${Request.AUTHENTICATION_SCHEME}${token}`);
    }

    public async get(): Promise<void> {
        await this.request("GET");
    }

    public async getToken(): Promise<void> {
        await this.request("GET");
    }

    public async post(body: unknown): Promise<void> {
        await this.request("POST", body);
    }

    public async put(body: unknown): Promise<void> {
        await this.request("PUT", body);
    }

    public async delete(): Promise<void> {
        await this.request("DELETE");
    }

    public getStatus(): number {
        return this.response?.status ?? 0;
    }

    public isError(): boolean {
        return this.response ? !this.response.ok : false;
    }

    public getError(): string | null {
        return this.errorMessage;
    }

    public readEntity<T>(): T | null {
        return (this.responseData as T) ?? null;
    }

    private async request(method: string, body?: unknown): Promise<void> {
        this.response = null;
        this.responseData = null;
        this.errorMessage = null;

        if (!this.url) {
            throw new Error("La URL objetivo no ha sido definida.");
        }

        const options: RequestInit = {
            method,
            headers: this.headers,
        };

        if (body !== undefined && method !== "GET" && method !== "DELETE") {
            options.body = JSON.stringify(body);
        }

        try {
            this.response = await fetch(this.url, options);

            const contentType = this.response.headers.get("content-type") ?? "";

            if (this.response.status === 204) {
                this.responseData = null;
            } else if (contentType.includes("application/json")) {
                this.responseData = await this.response.json();
            } else {
                this.responseData = await this.response.text();
            }

            if (!this.response.ok) {
                this.errorMessage = this.extractErrorMessage(this.responseData, this.response.statusText);
            }
        } catch (error) {
            this.errorMessage =
                error instanceof Error ? error.message : "Error desconocido en la petición";
            throw error;
        }
    }

    private extractErrorMessage(data: unknown, fallback: string): string {
        if (typeof data === "string" && data.trim()) {
            return data;
        }

        if (data && typeof data === "object") {
            const obj = data as Record<string, unknown>;

            if (typeof obj.mensaje === "string" && obj.mensaje.trim()) {
                return obj.mensaje;
            }

            if (typeof obj.message === "string" && obj.message.trim()) {
                return obj.message;
            }

            if (typeof obj.error === "string" && obj.error.trim()) {
                return obj.error;
            }

            return JSON.stringify(obj);
        }

        return fallback || "Error en la solicitud";
    }

    private joinUrl(...parts: string[]): string {
        return parts
            .filter(Boolean)
            .map((part, index) => {
                if (index === 0) return part.replace(/\/+$/, "");
                return part.replace(/^\/+|\/+$/g, "");
            })
            .join("/");
    }

}