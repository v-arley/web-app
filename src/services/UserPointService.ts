import { AxiosBaseService } from "../shared/utils/AxiosBaseService";
import { Response as Respuesta, type BackendResponse } from "../shared/utils/Response";
import { UserPoint } from "../models/UserPoint";

export class UserPointService extends AxiosBaseService {
  async findWorkerPoints(): Promise<Respuesta> {
    try {
      const { data } = await this.client.get<
        BackendResponse<{ item: UserPoint }> | UserPoint
      >("/user-points/worker");

      const pointData = this.extractItem<UserPoint>(data);
      const points = pointData ? new UserPoint(pointData) : null;

      return new Respuesta(
        true,
        "Puntos del trabajador obtenidos correctamente.",
        "",
        "registro",
        points,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(
          error,
          "No se pudieron obtener los puntos del trabajador",
        ),
        "",
        "registro",
        null,
      );
    }
  }
}

