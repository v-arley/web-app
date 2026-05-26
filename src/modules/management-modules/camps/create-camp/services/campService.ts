import { AxiosBaseService } from "../../../../../shared/utils/AxiosBaseService";
import type { BackendListPayload, BackendResponse } from "../../../../../shared/utils/Response";
import type { CampFormValues } from "../schemas/create-camp.schema";
import { campSchema, type CampRecord } from "../schemas/camp.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aun no existe o el contrato no es valido.";

export class CreateCampCampService extends AxiosBaseService {
	async getCamps(search?: string): Promise<CampRecord[]> {
		try {
			const normalizedSearch = search?.trim() ?? "";
			const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>("/camps", {
				params: normalizedSearch ? { search: normalizedSearch } : undefined,
			});
			const items = this.extractItems<unknown>(data);
			return items.map((item) => this.normalizeCamp(item));
		} catch (error) {
			throw new Error(this.resolveCatalogError(error));
		}
	}

	async createCamp(payload: CampFormValues): Promise<CampRecord> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: unknown }> | unknown>(
				"/camps",
				this.toWritePayload(payload),
			);
			this.assertSuccess(data, "No se pudo crear el campamento.");
			return this.normalizeCamp(this.extractItem<unknown>(data));
		} catch (error) {
			throw new Error(this.resolveCatalogError(error));
		}
	}

	async updateCamp(id: number, payload: Partial<CampFormValues>): Promise<CampRecord> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: unknown }> | unknown>(
				`/camps/${id}`,
				this.toWritePayload(payload),
			);
			this.assertSuccess(data, "No se pudo actualizar el campamento.");
			return this.normalizeCamp(this.extractItem<unknown>(data));
		} catch (error) {
			throw new Error(this.resolveCatalogError(error));
		}
	}

	async removeCamp(id: number): Promise<void> {
		try {
			const { data } = await this.client.delete<BackendResponse<Record<string, never>> | undefined>(`/camps/${id}`);
			this.assertSuccess(data, "No se pudo eliminar el campamento.");
		} catch (error) {
			throw new Error(this.resolveCatalogError(error));
		}
	}

	private normalizeCamp(input: unknown): CampRecord {
		const source = (input ?? {}) as Record<string, unknown>;
		return campSchema.parse({
			id: source.id ?? null,
			code: source.code ?? "",
			description: source.description ?? "",
			capacity: source.capacity ?? 1,
			location_x: source.location_x ?? null,
			location_y: source.location_y ?? null,
			admin_id: source.admin_id ?? null,
			state:
				source.state === "I" || source.active === false
					? "I"
					: "A",
			active: source.active,
			created_at: source.created_at ?? null,
		});
	}

	private toWritePayload(payload: Partial<CampFormValues>) {
		return {
			code: payload.code?.trim().toUpperCase(),
			description: payload.description?.trim(),
			capacity: payload.capacity,
			location_x: payload.location_x ?? 0,
			location_y: payload.location_y ?? 0,
			admin_id: payload.admin_id ?? undefined,
			state: payload.state,
		};
	}

	private assertSuccess(data: unknown, fallback: string): void {
		if (!data || typeof data !== "object" || !("estado" in data)) {
			return;
		}

		const response = data as BackendResponse<unknown>;
		if (response.estado) {
			return;
		}

		throw new Error(response.mensaje?.trim() || fallback);
	}

	private resolveCatalogError(error: unknown) {
		const extracted = this.extractErrorMessage(error, CONTRACT_ERROR_MESSAGE).trim();
		if (!extracted || extracted.includes("404") || extracted.includes("Cannot")) {
			return CONTRACT_ERROR_MESSAGE;
		}
		return extracted;
	}
}

export const campService = new CreateCampCampService();
