import { AxiosBaseService } from "../../../../shared/utils/AxiosBaseService";
import type { BackendResponse } from "../../../../shared/utils/Response";

const CONTRACT_ERROR_MESSAGE = "El endpoint aún no existe o el contrato no es válido.";

export type DailySummaryPersonStatus = "delivered" | "pending";

export interface DailySummaryPerson {
    person_id: number;
    dni: string;
    name: string;
    status: DailySummaryPersonStatus;
    ration_id: number | null;
    ration_created_at: string | null;
    notes: string | null;
}

export interface DailySummaryResourceConsumed {
    resource_id: number;
    resource_name: string;
    unit_of_measure: string;
    total_consumed: number;
}

export interface DailySummaryPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface DailySummary {
    date: string;
    camp_id: number;
    total_population: number;
    delivered: number;
    pending: number;
    stock_exhausted: boolean;
    delivery_rate: string;
    persons: DailySummaryPerson[];
    pagination: DailySummaryPagination;
    resources_consumed: DailySummaryResourceConsumed[];
}

export interface CompletePendingResult {
    completed_now: number;
    still_pending: number;
}

export class RationDailySummaryService extends AxiosBaseService {
    async getDailySummary(
        campId: number,
        options?: { date?: string; page?: number; limit?: number; status?: DailySummaryPersonStatus | "" },
    ): Promise<DailySummary> {
        try {
            const params = new URLSearchParams();
            params.set("camp_id", String(campId));
            if (options?.date) params.set("date", options.date);
            if (options?.page) params.set("page", String(options.page));
            if (options?.limit) params.set("limit", String(options.limit));
            if (options?.status) params.set("status", options.status);

            const { data } = await this.client.get<BackendResponse<{ item: unknown }> | unknown>(
                `/rations/daily-summary?${params.toString()}`,
            );

            const raw = (this.extractItem<Record<string, unknown>>(
                data as BackendResponse<{ item: Record<string, unknown> }> | Record<string, unknown>,
            ) ?? {}) as Partial<DailySummary>;
            const legacyNotAssigned = Number((raw as { not_assigned?: unknown }).not_assigned ?? 0);
            const persons: DailySummaryPerson[] = Array.isArray(raw.persons)
                ? raw.persons.map((person) => ({
                    ...person,
                    status: person.status === "delivered" ? "delivered" as const : "pending" as const,
                }))
                : [];

            return {
                date: raw.date ?? options?.date ?? "",
                camp_id: raw.camp_id ?? campId,
                total_population: raw.total_population ?? 0,
                delivered: raw.delivered ?? 0,
                pending: (raw.pending ?? 0) + legacyNotAssigned,
                stock_exhausted: raw.stock_exhausted ?? false,
                delivery_rate: raw.delivery_rate ?? "0%",
                persons,
                pagination: {
                    page: (raw.pagination as DailySummaryPagination)?.page ?? options?.page ?? 1,
                    limit: (raw.pagination as DailySummaryPagination)?.limit ?? options?.limit ?? 20,
                    total: (raw.pagination as DailySummaryPagination)?.total ?? 0,
                    totalPages: (raw.pagination as DailySummaryPagination)?.totalPages ?? 1,
                },
                resources_consumed: raw.resources_consumed ?? [],
            };
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    async completePendingRations(campId: number, date?: string): Promise<CompletePendingResult> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: unknown }> | unknown>(
                "/rations/complete-pending",
                { camp_id: campId, date },
            );

            const raw = (this.extractItem<Record<string, unknown>>(
                data as BackendResponse<{ item: Record<string, unknown> }> | Record<string, unknown>,
            ) ?? {}) as Partial<CompletePendingResult>;
            return {
                completed_now: raw.completed_now ?? 0,
                still_pending: raw.still_pending ?? 0,
            };
        } catch (error) {
            throw new Error(this.resolveError(error));
        }
    }

    private resolveError(error: unknown) {
        const extracted = this.extractErrorMessage(error, CONTRACT_ERROR_MESSAGE).trim();
        if (!extracted || extracted.includes("404") || extracted.includes("Cannot")) {
            return CONTRACT_ERROR_MESSAGE;
        }
        return extracted;
    }
}

export const rationDailySummaryService = new RationDailySummaryService();
