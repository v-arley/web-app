import {
    Response as Respuesta,
    type BackendResponse,
    type BackendListPayload,
} from "../shared/utils/Response";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";
import { ExplorationRation } from "../models/ExplorationRation";

export class ExplorationRationService extends AxiosBaseService {
    async findByExplorationId(explorationId: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<BackendListPayload<ExplorationRation>> |
                    ExplorationRation[]
            >(`/exploration-rations/exploration/${explorationId}`);

            const rations = this.extractItems<ExplorationRation>(data).map(
                (ration) => new ExplorationRation(ration),
            );

            return new Respuesta(
                true,
                "Raciones de exploración obtenidas correctamente.",
                "",
                "registros",
                rations,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(
                    error,
                    "No se pudieron obtener las raciones de la exploración",
                ),
                "",
            );
        }
    }
}