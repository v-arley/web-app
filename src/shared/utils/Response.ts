
export type BackendResponse<T = unknown> = {
    estado: boolean;
    codigoRespuesta: number;
    mensaje: string;
    mensajeInterno: string;
    resultado: T;
};

export type BackendListPayload<TItem = unknown> = {
    items: TItem[];
};

export class Response {
    private estado: boolean;
    private mensaje: string;
    private mensajeInterno: string;
    private resultado: Record<string, unknown>;

    constructor(estado: boolean = false, mensaje: string = "", mensajeInterno: string = "", nombre?: string, valor?: unknown) {
        this.estado = estado;
        this.mensaje = mensaje;
        this.mensajeInterno = mensajeInterno;
        this.resultado = {};

        if (nombre !== undefined) {
            this.resultado[nombre] = valor;
        }
    }

    public getResultado<T>(nombre: string): T | null {
        const data = this.resultado[nombre];
        if (data === undefined) {
            return null;
        }
        return data as T;
    }

    public setResultado(nombre: string, valor: unknown): void {
        this.resultado[nombre] = valor;
    }

    public getEstado(): boolean {
        return this.estado;
    }

    public setEstado(estado: boolean): void {
        this.estado = estado;
    }

    public getMensaje(): string {
        return this.mensaje;
    }

    public setMensaje(mensaje: string): void {
        this.mensaje = mensaje;
    }

    public getMensajeInterno(): string {
        return this.mensajeInterno;
    }

    public setMensajeInterno(mensajeInterno: string): void {
        this.mensajeInterno = mensajeInterno;
    }

}