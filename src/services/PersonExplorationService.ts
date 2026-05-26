import {
    Response as Respuesta,
    type BackendResponse,
    type BackendListPayload,
} from "../shared/utils/Response";
import {
    PersonExploration,
    type CreatePersonExploration,
} from "../models/PersonExploration";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class PersonExplorationService extends AxiosBaseService {
    async save(register: CreatePersonExploration): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<
                BackendResponse<{ item: PersonExploration }> | PersonExploration
            >("/person-explorations", register);

            const personExploration = this.extractItem<PersonExploration>(data);

            return new Respuesta(
                true,
                "Persona asignada correctamente.",
                "",
                "registro",
                personExploration,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo asignar la persona"),
                "",
                "registro",
                null,
            );
        }
    }

    async remove(explorationId: number, personId: number): Promise<Respuesta> {
        try {
            await this.client.delete(
                `/person-explorations/${explorationId}/${personId}`,
            );

            return new Respuesta(
                true,
                "Persona removida correctamente.",
                "",
                "registro",
                null,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo remover la persona"),
                "",
                "registro",
                null,
            );
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<BackendListPayload<PersonExploration>> |
                    PersonExploration[]
            >("/person-explorations");

            const personExplorations =
                this.extractItems<PersonExploration>(data).map(
                    (personExploration) =>
                        new PersonExploration(personExploration),
                );

            return new Respuesta(
                true,
                "Registros obtenidos correctamente.",
                "",
                "registros",
                personExplorations,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(
                    error,
                    "No se pudieron obtener los registros",
                ),
                "",
            );
        }
    }

    async findByExplorationId(explorationId: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<BackendListPayload<PersonExploration>> |
                    PersonExploration[]
            >(`/person-explorations/exploration/${explorationId}`);

            const personExplorations =
                this.extractItems<PersonExploration>(data).map(
                    (personExploration) =>
                        new PersonExploration(personExploration),
                );

            return new Respuesta(
                true,
                "Personas asignadas obtenidas correctamente.",
                "",
                "registros",
                personExplorations,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(
                    error,
                    "No se pudieron obtener las personas asignadas",
                ),
                "",
            );
        }
    }

    async findByPersonId(personId: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<BackendListPayload<PersonExploration>> |
                    PersonExploration[]
            >(`/person-explorations/person/${personId}`);

            const personExplorations =
                this.extractItems<PersonExploration>(data).map(
                    (personExploration) =>
                        new PersonExploration(personExploration),
                );

            return new Respuesta(
                true,
                "Exploraciones por persona obtenidas correctamente.",
                "",
                "registros",
                personExplorations,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(
                    error,
                    "No se pudieron obtener las exploraciones de la persona",
                ),
                "",
            );
        }
    }
}
