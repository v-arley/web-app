import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { RationResource } from "../models/RationResource";

export class RationResourceService {
    private request: Request;

    constructor() {
        this.request = new Request();
    }

    async save(register: RationResource): Promise<Respuesta> {
        const request = new Request("/ration-resources");
        await request.post(register);

        const data = request.readEntity<RationResource>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: RationResource): Promise<Respuesta> {
        const request = new Request("/ration-resources", "{id}", { id });
        await request.put(register);

        const data = request.readEntity<RationResource>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/ration-resources", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/ration-resources");
        await request.get();

        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }

        const rationResources = (data?.resultado?.items ?? []).map((rationResource) => new RationResource(rationResource));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", rationResources);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/ration-resources", "{id}", { id });
        await request.get();

        const data = request.readEntity<BackendResponse<{ item: RationResource }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }

        const rationResources = data?.resultado?.item ? new RationResource(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", rationResources);
    }
}