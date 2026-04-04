import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { Ration } from "../models/Ration";

export class RationService {
    private request: Request;

    constructor() {
        this.request = new Request();
    }

    async save(register: Ration): Promise<Respuesta> {
        const request = new Request("/rations");
        await request.post(register);

        const data = request.readEntity<Ration>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: Ration): Promise<Respuesta> {
        const request = new Request("/rations", "{id}", { id });
        await request.put(register);

        const data = request.readEntity<Ration>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/rations", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/rations");
        await request.get();

        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }

        const rations = (data?.resultado?.items ?? []).map((ration) => new Ration(ration));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", rations);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/rations", "{id}", { id });
        await request.get();

        const data = request.readEntity<BackendResponse<{ item: Ration }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }

        const rations = data?.resultado?.item ? new Ration(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", rations);
    }
}