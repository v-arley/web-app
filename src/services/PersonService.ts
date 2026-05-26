import {
  Response as Respuesta,
  type BackendListPayload,
  type BackendResponse,
} from "../shared/utils/Response";
import { Person, type CreatePerson, type UpdatePerson } from "../models/Person";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class PersonService extends AxiosBaseService {
  async save(register: CreatePerson): Promise<Respuesta> {
    try {
      const { data } = await this.client.post<
        BackendResponse<{ item: Person }> | Person
      >("/people", register);
      const person = this.extractItem<Person>(data);

      return new Respuesta(
        true,
        "Registro creado correctamente.",
        "",
        "registro",
        person,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(error, "No se pudo crear el registro"),
        "",
        "registro",
        null,
      );
    }
  }

  async update(id: number, register: UpdatePerson): Promise<Respuesta> {
    try {
      const { data } = await this.client.put<
        BackendResponse<{ item: Person }> | Person
      >(`/people/${id}`, register);
      const person = this.extractItem<Person>(data);

      return new Respuesta(
        true,
        "Registro actualizado correctamente.",
        "",
        "registro",
        person,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(error, "No se pudo actualizar el registro"),
        "",
        "registro",
        null,
      );
    }
  }

  async remove(id: number): Promise<Respuesta> {
    try {
      await this.client.delete(`/people/${id}`);

      return new Respuesta(
        true,
        "Registro eliminado correctamente.",
        "",
        "registro",
        null,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(error, "No se pudo eliminar el registro"),
        "",
        "registro",
        null,
      );
    }
  }

  async findAll(): Promise<Respuesta> {
    try {
      const { data } = await this.client.get<
        BackendResponse<BackendListPayload<Person>> | Person[]
      >("/people");
      const people = this.extractItems<Person>(data).map(
        (person) => new Person(person),
      );

      return new Respuesta(
        true,
        "Registros obtenidos correctamente.",
        "",
        "registros",
        people,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(error, "No se pudieron obtener los registros"),
        "",
      );
    }
  }

  async findById(id: number): Promise<Respuesta> {
    try {
      const { data } = await this.client.get<
        BackendResponse<{ item: Person }> | Person
      >(`/people/${id}`);
      const personData = this.extractItem<Person>(data);
      const person = personData ? new Person(personData) : null;

      return new Respuesta(
        true,
        "Registro obtenido correctamente.",
        "",
        "registro",
        person,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(error, "No se pudo obtener el registro"),
        "",
        "registro",
        null,
      );
    }
  }

  async findWorkerProfile(): Promise<Respuesta> {
    try {
      const { data } = await this.client.get<
        BackendResponse<{ item: Person }> | Person
      >("/people/worker");
      const personData = this.extractItem<Person>(data);
      const person = personData ? new Person(personData) : null;

      return new Respuesta(
        true,
        "Perfil del trabajador obtenido correctamente.",
        "",
        "registro",
        person,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(
          error,
          "No se pudo obtener el perfil del trabajador",
        ),
        "",
        "registro",
        null,
      );
    }
  }
}

