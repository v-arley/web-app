import axios, { AxiosError, type AxiosInstance } from "axios";
import type { BackendListPayload, BackendResponse } from "../utils/Response";

export abstract class AxiosBaseService {
	protected client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
			headers: {
				"Content-Type": "application/json; charset=UTF-8",
			},
		});
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