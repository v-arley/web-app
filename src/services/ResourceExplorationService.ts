import {
    Response as Respuesta,
    type BackendResponse,
    type BackendListPayload,
} from "../shared/utils/Response";
import {
    ExplorationResource,
    type CreateExplorationResource,
} from "../models/ExplorationResource";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class ResourceExplorationService extends AxiosBaseService {
    async save(register: CreateExplorationResource): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<
                BackendResponse<{ item: ExplorationResource }> | ExplorationResource
            >("/exploration-resources", register);

            const explorationResource = this.extractItem<ExplorationResource>(data);

            return new Respuesta(
                true,
                "Recurso asignado correctamente.",
                "",
                "registro",
                explorationResource,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo asignar el recurso"),
                "",
                "registro",
                null,
            );
        }
    }

    async remove(explorationId: number, resourceId: number): Promise<Respuesta> {
        try {
            await this.client.delete(
                `/exploration-resources/${explorationId}/${resourceId}`,
            );

            return new Respuesta(
                true,
                "Recurso removido correctamente.",
                "",
                "registro",
                null,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo remover el recurso"),
                "",
                "registro",
                null,
            );
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<BackendListPayload<ExplorationResource>> |
                    ExplorationResource[]
            >("/exploration-resources");

            const explorationResources =
                this.extractItems<ExplorationResource>(data).map(
                    (explorationResource) =>
                        new ExplorationResource(explorationResource),
                );

            return new Respuesta(
                true,
                "Registros obtenidos correctamente.",
                "",
                "registros",
                explorationResources,
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
                BackendResponse<BackendListPayload<ExplorationResource>> |
                    ExplorationResource[]
            >(`/exploration-resources/exploration/${explorationId}`);

            const explorationResources =
                this.extractItems<ExplorationResource>(data).map(
                    (explorationResource) =>
                        new ExplorationResource(explorationResource),
                );

            return new Respuesta(
                true,
                "Recursos asignados obtenidos correctamente.",
                "",
                "registros",
                explorationResources,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(
                    error,
                    "No se pudieron obtener los recursos asignados",
                ),
                "",
            );
        }
    }

    async findByResourceId(resourceId: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<BackendListPayload<ExplorationResource>> |
                    ExplorationResource[]
            >(`/exploration-resources/resource/${resourceId}`);

            const explorationResources =
                this.extractItems<ExplorationResource>(data).map(
                    (explorationResource) =>
                        new ExplorationResource(explorationResource),
                );

            return new Respuesta(
                true,
                "Exploraciones por recurso obtenidas correctamente.",
                "",
                "registros",
                explorationResources,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(
                    error,
                    "No se pudieron obtener las exploraciones del recurso",
                ),
                "",
            );
        }
    }
}
