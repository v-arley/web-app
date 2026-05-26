import {
  Response as Respuesta,
  type BackendResponse,
  type BackendListPayload,
} from "../shared/utils/Response";
import {
  Exploration,
  type CreateExploration,
  type UpdateExploration,
  type WorkerExplorationFilters,
  type WorkerExplorationPage,
} from "../models/Exploration";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class ExplorationService extends AxiosBaseService {
  async save(register: CreateExploration): Promise<Respuesta> {
    try {
      const { data } = await this.client.post<
        BackendResponse<{ item: Exploration }> | Exploration
      >("/explorations", register);

      const explorationData = this.extractItem<Exploration>(data);
      const exploration = explorationData
        ? new Exploration(explorationData)
        : null;

      return new Respuesta(
        true,
        "Registro creado correctamente.",
        "",
        "registro",
        exploration,
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

  async update(id: number, register: UpdateExploration): Promise<Respuesta> {
    try {
      const { data } = await this.client.put<
        BackendResponse<{ item: Exploration }> | Exploration
      >(`/explorations/${id}`, register);

      const explorationData = this.extractItem<Exploration>(data);
      const exploration = explorationData
        ? new Exploration(explorationData)
        : null;

      return new Respuesta(
        true,
        "Registro actualizado correctamente.",
        "",
        "registro",
        exploration,
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
      await this.client.delete(`/explorations/${id}`);

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
        BackendResponse<BackendListPayload<Exploration>> | Exploration[]
      >("/explorations");

      const explorations = this.extractItems<Exploration>(data).map(
        (exploration) => new Exploration(exploration),
      );

      return new Respuesta(
        true,
        "Registros obtenidos correctamente.",
        "",
        "registros",
        explorations,
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
        BackendResponse<{ item: Exploration }> | Exploration
      >(`/explorations/${id}`);

      const explorationData = this.extractItem<Exploration>(data);
      const exploration = explorationData
        ? new Exploration(explorationData)
        : null;

      return new Respuesta(
        true,
        "Registro obtenido correctamente.",
        "",
        "registro",
        exploration,
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

  async findWorkerExplorations(
    filters: WorkerExplorationFilters,
  ): Promise<Respuesta> {
    try {
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 10;

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", String(limit));

      if (filters.name) params.set("name", filters.name);
      if (filters.state) params.set("state", filters.state);
      if (filters.riskLevel) params.set("riskLevel", filters.riskLevel);

      const { data } = await this.client.get<
        BackendResponse<{ item: WorkerExplorationPage }> | WorkerExplorationPage
      >(`/explorations/worker?${params.toString()}`);

      const pageData = this.extractItem<WorkerExplorationPage>(data);

      const result: WorkerExplorationPage = pageData
        ? {
            ...pageData,
            items: (pageData.items ?? []).map(
              (exploration) => new Exploration(exploration),
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
        "Exploraciones del trabajador obtenidas correctamente.",
        "",
        "registro",
        result,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(
          error,
          "No se pudieron obtener las exploraciones del trabajador",
        ),
        "",
        "registro",
        {
          page: filters.page ?? 1,
          limit: filters.limit ?? 10,
          total: 0,
          totalPages: 1,
          items: [],
        },
      );
    }
  }
}

