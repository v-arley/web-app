import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { Exploration, type CreateExploration, type UpdateExploration } from "../models/Exploration";

export class ExplorationService {
    private request: Request;

    constructor(){
        this.request = new Request();
    }

    async save(register: Exploration): Promise<Respuesta> {
        const request = new Request("/explorations");
        await request.post(register);
    
        const data = request.readEntity<Exploration>();
    
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: Exploration): Promise<Respuesta> {
        const request = new Request("/explorations", "{id}", { id });
        await request.put(register);
    
        const data = request.readEntity<Exploration>();
    
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }
    
        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/explorations", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/explorations");
        await request.get();
    
        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }
    
        const explorations = (data?.resultado?.items ?? []).map((exploration) => new Exploration(exploration));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", explorations);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/exploration", "{id}", { id });
        await request.get();
    
        const data = request.readEntity<BackendResponse<{ item: Exploration }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }
    
        const explorations = data?.resultado?.item ? new Exploration(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", explorations);
    }

}