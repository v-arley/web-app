import {
  Response as Respuesta,
  type BackendResponse,
  type BackendListPayload,
} from "../utils/Response";
import {
  Ration,
  type CreateRation,
  type UpdateRation,
  type WorkerRationHistoryPage,
} from "../models/Ration";
import { AxiosBaseService } from "./AxiosBaseService";

type WorkerRationCurrentPayload =
  | Ration
  | Ration[]
  | {
      item?: Ration | Ration[];
      items?: Ration | Ration[];
    };

export class RationService extends AxiosBaseService {
  private normalizeCurrentRation(payload: unknown): Ration | null {
    if (!payload) return null;

    if (Array.isArray(payload)) {
      return payload.length > 0 ? new Ration(payload[0]) : null;
    }

    if (typeof payload === "object") {
      const data = payload as WorkerRationCurrentPayload;

      if ("items" in data) {
        if (Array.isArray(data.items)) {
          return data.items.length > 0 ? new Ration(data.items[0]) : null;
        }

        if (data.items) {
          return new Ration(data.items);
        }
      }

      if ("item" in data) {
        if (Array.isArray(data.item)) {
          return data.item.length > 0 ? new Ration(data.item[0]) : null;
        }

        if (data.item) {
          return new Ration(data.item);
        }
      }

      return new Ration(payload as Partial<Ration>);
    }

    return null;
  }

  async save(register: CreateRation): Promise<Respuesta> {
    try {
      const { data } = await this.client.post<
        BackendResponse<{ item: Ration }> | Ration
      >("/rations", register);

      const rationData = this.extractItem<Ration>(data);
      const ration = rationData ? new Ration(rationData) : null;

      return new Respuesta(
        true,
        "Registro creado correctamente.",
        "",
        "registro",
        ration,
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

  async update(id: number, register: UpdateRation): Promise<Respuesta> {
    try {
      const { data } = await this.client.put<
        BackendResponse<{ item: Ration }> | Ration
      >(`/rations/${id}`, register);

      const rationData = this.extractItem<Ration>(data);
      const ration = rationData ? new Ration(rationData) : null;

      return new Respuesta(
        true,
        "Registro actualizado correctamente.",
        "",
        "registro",
        ration,
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
      await this.client.delete(`/rations/${id}`);

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
        BackendResponse<BackendListPayload<Ration>> | Ration[]
      >("/rations");

      const rations = this.extractItems<Ration>(data).map(
        (ration) => new Ration(ration),
      );

      return new Respuesta(
        true,
        "Registros obtenidos correctamente.",
        "",
        "registros",
        rations,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(error, "No se pudieron obtener los registros"),
        "",
        "registros",
        [],
      );
    }
  }

  async findById(id: number): Promise<Respuesta> {
    try {
      const { data } = await this.client.get<
        BackendResponse<{ item: Ration }> | Ration
      >(`/rations/${id}`);

      const rationData = this.extractItem<Ration>(data);
      const ration = rationData ? new Ration(rationData) : null;

      return new Respuesta(
        true,
        "Registro obtenido correctamente.",
        "",
        "registro",
        ration,
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

  async findWorkerRation(): Promise<Respuesta> {
    try {
      const { data } = await this.client.get<
        BackendResponse<{ item?: unknown; items?: unknown }> | unknown
      >("/rations/worker");

      let raw: unknown = null;

      if (data && typeof data === "object" && "resultado" in data) {
        const wrapped = data as BackendResponse<{
          item?: unknown;
          items?: unknown;
        }>;

        raw = wrapped.resultado?.item ?? wrapped.resultado?.items ?? null;
      } else {
        raw = data;
      }

      const ration = this.normalizeCurrentRation(raw);

      return new Respuesta(
        true,
        "Ración del trabajador obtenida correctamente.",
        "",
        "registro",
        ration,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(
          error,
          "No se pudo obtener la ración del trabajador",
        ),
        "",
        "registro",
        null,
      );
    }
  }

  async findWorkerRationHistory(page = 1, limit = 10): Promise<Respuesta> {
    try {
      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", String(limit));

      const { data } = await this.client.get<
        | BackendResponse<{ item: WorkerRationHistoryPage }>
        | WorkerRationHistoryPage
      >(`/rations/worker/history?${params.toString()}`);

      const historyData = this.extractItem<WorkerRationHistoryPage>(data);

      const history: WorkerRationHistoryPage = historyData
        ? {
            ...historyData,
            items: (historyData.items ?? []).map(
              (ration) => new Ration(ration),
            ),
          }
        : {
            page,
            limit,
            total: 0,
            totalPages: 1,
            items: [],
          };

      return new Respuesta(
        true,
        "Historial de raciones obtenido correctamente.",
        "",
        "registro",
        history,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(
          error,
          "No se pudo obtener el historial de raciones",
        ),
        "",
        "registro",
        {
          page,
          limit,
          total: 0,
          totalPages: 1,
          items: [],
        },
      );
    }
  }
}
