import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { WarehouseResource } from "../models/WarehouseResource";

export class ResourceWarehouseService {
    private request: Request;

    constructor() {
        this.request = new Request();
    }

    async save(register: WarehouseResource): Promise<Respuesta> {
        const request = new Request("/warehouse-resources");
        await request.post(register);

        const data = request.readEntity<WarehouseResource>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: WarehouseResource): Promise<Respuesta> {
        const request = new Request("/warehouse-resources", "{id}", { id });
        await request.put(register);

        const data = request.readEntity<WarehouseResource>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/warehouse-resources", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/warehouse-resources");
        await request.get();

        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }

        const warehouseResources = (data?.resultado?.items ?? []).map((warehouseResource) => new WarehouseResource(warehouseResource));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", warehouseResources);
    }
}