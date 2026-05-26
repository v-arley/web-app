import { Response as Respuesta, type BackendResponse } from "../shared/utils/Response";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";
import { CampProductionRule } from "../models/CampProductionRule";
import type {
  CreateWorkerResourceProduction,
  WorkerProductionHistoryPage,
  WorkerProductionResult,
} from "../models/ResourceProduction";

type WorkerProductionRuleEnvelope = {
  personId?: number;
  campId?: number;
  camp_id?: number;
  profession?: {
    id?: number;
    code?: string;
    name?: string;
    isTemporary?: boolean;
    temporaryUntil?: string | Date | null;
  };
  rules?: Partial<CampProductionRule>[];
};

type RulePayload = {
  item?: unknown;
  items?: unknown[];
  rules?: Partial<CampProductionRule>[];
};

export class ResourceProductionService extends AxiosBaseService {
  private normalizeRules(payload: unknown): CampProductionRule[] {
    if (!payload) return [];

    if (Array.isArray(payload)) {
      return payload.map((rule) => new CampProductionRule(rule));
    }

    if (typeof payload !== "object") return [];

    const data = payload as RulePayload | WorkerProductionRuleEnvelope;

    if ("rules" in data && Array.isArray(data.rules)) {
      const envelope = data as WorkerProductionRuleEnvelope;
      const rules = data.rules;

      return rules.map(
        (rule) =>
          new CampProductionRule({
            ...rule,
            campId: envelope.campId ?? envelope.camp_id,
            professionId: envelope.profession?.id,
            profession: envelope.profession ?? null,
          }),
      );
    }

    if ("items" in data && Array.isArray(data.items)) {
      return data.items.map(
        (rule) => new CampProductionRule(rule as Partial<CampProductionRule>),
      );
    }

    if ("item" in data) {
      if (Array.isArray(data.item)) {
        return data.item.map(
          (rule) => new CampProductionRule(rule as Partial<CampProductionRule>),
        );
      }

      return this.normalizeRules(data.item);
    }

    return [new CampProductionRule(payload as Partial<CampProductionRule>)];
  }

  async findWorkerProductionRule(): Promise<Respuesta> {
    try {
      const { data } = await this.client.get<
        BackendResponse<{ item: unknown }> | unknown
      >("/resource-productions/worker/rule");

      const raw = this.extractItem<unknown>(data);
      const rules = this.normalizeRules(raw);

      return new Respuesta(
        true,
        "Reglas de producciÃ³n obtenidas correctamente.",
        "",
        "registros",
        rules,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(
          error,
          "No se pudieron obtener las reglas de producciÃ³n del trabajador",
        ),
        "",
        "registros",
        [],
      );
    }
  }

  async saveWorkerProduction(
    register: CreateWorkerResourceProduction,
  ): Promise<Respuesta> {
    try {
      const { data } = await this.client.post<
        | BackendResponse<{ item: WorkerProductionResult }>
        | WorkerProductionResult
      >("/resource-productions/worker", register);

      const result = this.extractItem<WorkerProductionResult>(data);

      return new Respuesta(
        true,
        "ProducciÃ³n registrada correctamente.",
        "",
        "registro",
        result ?? null,
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(
          error,
          "No se pudo registrar la producciÃ³n del trabajador",
        ),
        "",
        "registro",
        null,
      );
    }
  }

  async findWorkerProductionHistory(
    page = 1,
    limit = 10,
    startDate?: string,
    endDate?: string,
  ): Promise<Respuesta> {
    try {
      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", String(limit));

      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const { data } = await this.client.get<
        | BackendResponse<{ item: WorkerProductionHistoryPage }>
        | WorkerProductionHistoryPage
      >(`/resource-productions/worker/history?${params.toString()}`);

      const history = this.extractItem<WorkerProductionHistoryPage>(data);

      return new Respuesta(
        true,
        "Historial de producciÃ³n obtenido correctamente.",
        "",
        "registro",
        history ?? {
          page,
          limit,
          total: 0,
          totalPages: 1,
          items: [],
        },
      );
    } catch (error) {
      return new Respuesta(
        false,
        this.extractErrorMessage(
          error,
          "No se pudo obtener el historial de producciÃ³n",
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

