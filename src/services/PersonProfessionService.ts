import {
    Response as Respuesta,
    type BackendListPayload,
    type BackendResponse,
} from "../utils/Response";
import {
    PersonProfession,
    type CreatePersonProfession,
    type UpdatePersonProfession,
} from "../models/PersonProfession";
import { AxiosBaseService } from "./AxiosBaseService";

export class PersonProfessionService extends AxiosBaseService {
    async save(register: CreatePersonProfession): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<
                BackendResponse<{ item: PersonProfession }> | PersonProfession
            >("/person-professions", register);

            const item = this.extractItem<PersonProfession>(data);

            return new Respuesta(
                true,
                "Profesión asignada correctamente.",
                "",
                "registro",
                item,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo asignar la profesión"),
                "",
                "registro",
                null,
            );
        }
    }

    async update(
        personId: number,
        professionId: number,
        register: UpdatePersonProfession,
    ): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<
                BackendResponse<{ item: PersonProfession }> | PersonProfession
            >(`/person-professions/${personId}/${professionId}`, register);

            const item = this.extractItem<PersonProfession>(data);

            return new Respuesta(
                true,
                "Asignación actualizada correctamente.",
                "",
                "registro",
                item,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo actualizar la asignación"),
                "",
                "registro",
                null,
            );
        }
    }

    async remove(personId: number, professionId: number): Promise<Respuesta> {
        try {
            await this.client.delete(`/person-professions/${personId}/${professionId}`);

            return new Respuesta(
                true,
                "Asignación eliminada correctamente.",
                "",
                "registro",
                null,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo eliminar la asignación"),
                "",
                "registro",
                null,
            );
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<BackendListPayload<PersonProfession>> | PersonProfession[]
            >("/person-professions");

            const items = this.extractItems<PersonProfession>(data).map(
                (item) => new PersonProfession(item),
            );

            return new Respuesta(
                true,
                "Asignaciones obtenidas correctamente.",
                "",
                "registros",
                items,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudieron obtener las asignaciones"),
                "",
                "registros",
                [],
            );
        }
    }

    async findByPersonId(personId: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<BackendListPayload<PersonProfession>> | PersonProfession[]
            >(`/person-professions/person/${personId}`);

            const items = this.extractItems<PersonProfession>(data).map(
                (item) => new PersonProfession(item),
            );

            return new Respuesta(
                true,
                "Asignaciones obtenidas correctamente.",
                "",
                "registros",
                items,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudieron obtener las asignaciones"),
                "",
                "registros",
                [],
            );
        }
    }

    async findByProfessionId(professionId: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<BackendListPayload<PersonProfession>> | PersonProfession[]
            >(`/person-professions/profession/${professionId}`);

            const items = this.extractItems<PersonProfession>(data).map(
                (item) => new PersonProfession(item),
            );

            return new Respuesta(
                true,
                "Asignaciones obtenidas correctamente.",
                "",
                "registros",
                items,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudieron obtener las asignaciones"),
                "",
                "registros",
                [],
            );
        }
    }
}