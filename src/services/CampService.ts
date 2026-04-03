import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { Camp, type CreateCamp, type UpdateCamp } from "../models/Camp";

export class CampService {
    private request: Request;

    constructor() {
        this.request = new Request();
    }

    async save(register: Camp): Promise<Respuesta> {
        const request = new Request("/camps");
        await request.post(register);

        const data = request.readEntity<Camp>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: Camp): Promise<Respuesta> {
        const request = new Request("/camps", "{id}", { id });
        await request.put(register);

        const data = request.readEntity<Camp>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/camps", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/camps");
        await request.get();

        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }

        const camps = (data?.resultado?.items ?? []).map((camp) => new Camp(camp));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", camps);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/camps", "{id}", { id });
        await request.get();

        const data = request.readEntity<BackendResponse<{ item: Camp }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }

        const camp = data?.resultado?.item ? new Camp(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", camp);
    }

}