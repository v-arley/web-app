
import { Request } from "../utils/Request";
import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { Person, type CreatePerson, type UpdatePerson } from "../models/Person";

export class PersonService {
    private request: Request;

    constructor() {
        this.request = new Request();
    }

    async save(register: Person): Promise<Respuesta> {
        const request = new Request("/people");
        await request.post(register);

        const data = request.readEntity<Person>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo crear el registro", "", "registro", null);
        }
        return new Respuesta(true, "Registro creado correctamente.", "", "registro", data);
    }

    async update(id: number, register: Person): Promise<Respuesta> {
        const request = new Request("/people", "{id}", { id });
        await request.put(register);

        const data = request.readEntity<Person>();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo actualizar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", data);
    }

    async remove(id: number): Promise<Respuesta> {
        const request = new Request("/people", "{id}", { id });
        await request.delete();

        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo eliminar el registro", "", "registro", null);
        }

        return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
    }

    async findAll(): Promise<Respuesta> {
        const request = new Request("/people");
        await request.get();

        const data = request.readEntity<BackendResponse<BackendListPayload>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudieron obtener los registros", "");
        }

        const people = (data?.resultado?.items ?? []).map((person) => new Person(person));
        return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", people);
    }

    async findById(id: number): Promise<Respuesta> {
        const request = new Request("/people", "{id}", { id });
        await request.get();

        const data = request.readEntity<BackendResponse<{ item: Person }>>();
        if (request.isError()) {
            return new Respuesta(false, request.getError() ?? "No se pudo obtener el registro", "", "registro", null);
        }

        const person = data?.resultado?.item ? new Person(data.resultado.item) : null;
        return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", person);
    }
}