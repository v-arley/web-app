import { AxiosBaseService } from "../shared/utils/AxiosBaseService";
import { Response as Respuesta, type BackendResponse } from "../shared/utils/Response";
import { Achievement, type AchievementPage } from "../models/Achievement";

type AchievementPagePayload = Omit<AchievementPage, "items"> & {
  items: Achievement[];
};

export class AchievementService extends AxiosBaseService {
  async findWorkerUnlocked(page = 1, limit = 10): Promise<Respuesta> {
    try {
      const { data } = await this.client.get<
        BackendResponse<{ item: AchievementPagePayload }>
      >(`/achievements/worker/unlocked?page=${page}&limit=${limit}`);

      const payload = this.extractItem<AchievementPagePayload>(data);

      const result: AchievementPage = {
        page: payload?.page ?? page,
        limit: payload?.limit ?? limit,
        total: payload?.total ?? 0,
        totalPages: payload?.totalPages ?? 1,
        items: (payload?.items ?? []).map((item) => new Achievement(item)),
      };

      return new Respuesta(
        true,
        "Logros obtenidos cargados correctamente.",
        "",
        "registro",
        result,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(
          error,
          "No se pudieron obtener los logros desbloqueados",
        ),
        "",
        "registro",
        null,
      );
    }
  }

  async findWorkerPending(page = 1, limit = 10): Promise<Respuesta> {
    try {
      const { data } = await this.client.get<
        BackendResponse<{ item: AchievementPagePayload }>
      >(`/achievements/worker/pending?page=${page}&limit=${limit}`);

      const payload = this.extractItem<AchievementPagePayload>(data);

      const result: AchievementPage = {
        page: payload?.page ?? page,
        limit: payload?.limit ?? limit,
        total: payload?.total ?? 0,
        totalPages: payload?.totalPages ?? 1,
        items: (payload?.items ?? []).map((item) => new Achievement(item)),
      };

      return new Respuesta(
        true,
        "Logros pendientes cargados correctamente.",
        "",
        "registro",
        result,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(
          error,
          "No se pudieron obtener los logros pendientes",
        ),
        "",
        "registro",
        null,
      );
    }
  }
}

