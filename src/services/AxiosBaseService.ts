import axios, { AxiosError, type AxiosInstance } from "axios";
import axiosClient from "../api/axiosClient";
import type { BackendListPayload, BackendResponse } from "../utils/Response";

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