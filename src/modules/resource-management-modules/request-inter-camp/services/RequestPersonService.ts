import { AxiosBaseService } from "../../../../shared/utils/AxiosBaseService";
import type { BackendListPayload, BackendResponse } from "../../../../shared/utils/Response";
import { requestPersonSchema, type RequestPersonFormValues } from "../schemas/request-person.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aún no existe o el contrato no es válido.";

export class RequestPersonService extends AxiosBaseService {
  async getRequestPersons(requestId: number): Promise<RequestPersonFormValues[]> {
    try {
      const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>(
        `/request-persons?request_id=${requestId}`,
      );

      const items = this.extractItems<unknown>(data);
      return items.map((item) => this.normalizeRequestPerson(item));
    } catch (error) {
      throw new Error(this.resolveError(error));
    }
  }

  async createRequestPersons(
    requestId: number,
    persons: Array<{ person_id: number }>,
  ): Promise<RequestPersonFormValues[]> {
    try {
      const { data } = await this.client.post<BackendResponse<{ items: unknown[] }> | unknown[]>(
        "/request-persons/bulk",
        {
          request_id: requestId,
          persons,
        },
      );

      const items = this.extractItems<unknown>(data as BackendResponse<BackendListPayload<unknown>> | unknown[]);
      return items.map((item) => this.normalizeRequestPerson(item));
    } catch (error) {
      throw new Error(this.resolveError(error));
    }
  }

  async replaceRequestPersons(
    requestId: number,
    persons: Array<{ person_id: number }>,
  ): Promise<RequestPersonFormValues[]> {
    try {
      const { data } = await this.client.put<BackendResponse<{ items: unknown[] }> | unknown[]>(
        "/request-persons/bulk",
        {
          request_id: requestId,
          persons,
        },
      );

      const items = this.extractItems<unknown>(data as BackendResponse<BackendListPayload<unknown>> | unknown[]);
      return items.map((item) => this.normalizeRequestPerson(item));
    } catch (error) {
      throw new Error(this.resolveError(error));
    }
  }

  private normalizeRequestPerson(input: unknown): RequestPersonFormValues {
    const source = (input ?? {}) as Record<string, unknown>;
    return requestPersonSchema.parse({
      id: source.id ?? null,
      request_id: source.request_id ?? 0,
      person_id: source.person_id ?? 0,
      person: source.person ?? null,
    });
  }

  private resolveError(error: unknown) {
    const extracted = this.extractErrorMessage(error, CONTRACT_ERROR_MESSAGE).trim();
    if (!extracted || extracted.includes("404") || extracted.includes("Cannot")) {
      return CONTRACT_ERROR_MESSAGE;
    }
    return extracted;
  }
}

export const requestPersonService = new RequestPersonService();
