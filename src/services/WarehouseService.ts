import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { Warehouse, type CreateWarehouse, type UpdateWarehouse } from "../models/Warehouse";

export class WarehouseService {
    private request: Request;

    constructor() {
        this.request = new Request();
    }

    async save(register: Warehouse): Promise<Respuesta> {
        const request = new Request("/warehouses");
        await request.post(register);
    
        const data = request.readEntity<Warehouse>();
    
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: Warehouse): Promise<Respuesta> {
        const request = new Request("/warehouses", "{id}", { id });
        await request.put(register);
    
        const data = request.readEntity<Warehouse>();
    
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }
    
        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/warehouses", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/warehouses");
        await request.get();
    
        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }
    
        const warehouses = (data?.resultado?.items ?? []).map((warehouse) => new Warehouse(warehouse));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", warehouses);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/warehouses", "{id}", { id });
        await request.get();
    
        const data = request.readEntity<BackendResponse<{ item: Warehouse }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }
    
        const warehouses = data?.resultado?.item ? new Warehouse(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", warehouses);
    }
}