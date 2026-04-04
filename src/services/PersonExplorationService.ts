import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { PersonExploration } from "../models/PersonExploration";

export class PersonExplorationService {
    private request: Request;

    constructor() {
        this.request = new Request();
    }

    async save(register: PersonExploration): Promise<Respuesta> {
        const request = new Request("/person-explorations");
        await request.post(register);

        const data = request.readEntity<PersonExploration>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: PersonExploration): Promise<Respuesta> {
        const request = new Request("/person-explorations", "{id}", { id });
        await request.put(register);

        const data = request.readEntity<PersonExploration>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/person-explorations", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/person-explorations");
        await request.get();

        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }

        const personExplorations = (data?.resultado?.items ?? []).map((personExploration) => new PersonExploration(personExploration));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", personExplorations);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/person-explorations", "{id}", { id });
        await request.get();

        const data = request.readEntity<BackendResponse<{ item: PersonExploration }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }

        const personExplorations = data?.resultado?.item ? new PersonExploration(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", personExplorations);
    }
}
