import axios, { AxiosError, type AxiosInstance } from "axios";
import axiosClient from "../../api/axiosClient";
import type { BackendListPayload, BackendResponse, PaginatedResult, PaginationMeta } from "../../shared/utils/Response";

export abstract class AxiosBaseService {
	protected client: AxiosInstance;

	/**
	 * @param client Instancia de Axios a utilizar. Por defecto usa el cliente
	 *               centralizado con interceptores JWT y manejo de 401.
	 */
	constructor(client?: AxiosInstance) {
		this.client = client ?? axiosClient;
	}

	protected extractItem<T>(data: BackendResponse<{ item: T }> | T): T {
		if (data && typeof data === "object" && "resultado" in data) {
			const wrapped = data as BackendResponse<{ item: T }>;
			return wrapped.resultado?.item;
		}
		return data as T;
	}

	protected extractItems<T>(data: BackendResponse<BackendListPayload<T>> | T[]): T[] {
		if (Array.isArray(data)) return data;

		if (data && typeof data === "object" && "resultado" in data) {
			const wrapped = data as BackendResponse<BackendListPayload<T>>;
			return wrapped.resultado?.items ?? [];
		}

		return [];
	}

	protected extractPaginatedItems<T, TFacets = unknown>(
		data: BackendResponse<BackendListPayload<T>> | T[],
		fallbackPage = 1,
		fallbackLimit = 20,
	): PaginatedResult<T, TFacets> {
		if (Array.isArray(data)) {
			return {
				items: data,
				pagination: {
					page: fallbackPage,
					limit: fallbackLimit,
					total: data.length,
					totalPages: Math.max(1, Math.ceil(data.length / fallbackLimit)),
				},
			};
		}

		if (data && typeof data === "object" && "resultado" in data) {
			const payload = (data as BackendResponse<BackendListPayload<T>>).resultado;
			const items = payload?.items ?? [];
			const pagination = this.normalizePagination(payload?.pagination, items.length, fallbackPage, fallbackLimit);
			return {
				items,
				pagination,
				facets: payload?.facets as TFacets | undefined,
			};
		}

		return {
			items: [],
			pagination: this.normalizePagination(undefined, 0, fallbackPage, fallbackLimit),
		};
	}

	private normalizePagination(value: unknown, itemCount: number, fallbackPage: number, fallbackLimit: number): PaginationMeta {
		if (value && typeof value === "object") {
			const source = value as Record<string, unknown>;
			const page = Number(source.page);
			const limit = Number(source.limit);
			const total = Number(source.total);
			const totalPages = Number(source.totalPages);
			if (
				Number.isInteger(page) &&
				page > 0 &&
				Number.isInteger(limit) &&
				limit > 0 &&
				Number.isInteger(total) &&
				total >= 0 &&
				Number.isInteger(totalPages) &&
				totalPages > 0
			) {
				return { page, limit, total, totalPages };
			}
		}

		return {
			page: fallbackPage,
			limit: fallbackLimit,
			total: itemCount,
			totalPages: Math.max(1, Math.ceil(itemCount / fallbackLimit)),
		};
	}

	protected extractErrorMessage(error: unknown, fallback: string): string {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<unknown>;
			const responseData = axiosError.response?.data;

			if (typeof responseData === "string" && responseData.trim()) {
				return responseData;
			}

			if (responseData && typeof responseData === "object") {
				const obj = responseData as Record<string, unknown>;

				if (typeof obj.mensaje === "string" && obj.mensaje.trim()) return obj.mensaje;
				if (typeof obj.message === "string" && obj.message.trim()) return obj.message;
				if (typeof obj.error === "string" && obj.error.trim()) return obj.error;
			}

			return axiosError.message || fallback;
		}

		if (error instanceof Error && error.message.trim()) {
			return error.message;
		}

		return fallback;
	}
}
