import { AxiosBaseService } from "../../../../../services/AxiosBaseService";
import type { BackendResponse } from "../../../../../utils/Response";
import { warehouseSchema, type WarehouseRecord } from "../schemas/warehouse.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aun no existe o el contrato no es valido.";

type CreateWarehouseInput = {
	name: string;
	location_details: string;
	camp_id: number;
	admin_id?: number | null;
};

export class CreateCampWarehouseService extends AxiosBaseService {
	async createWarehouse(payload: CreateWarehouseInput): Promise<WarehouseRecord> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: unknown }> | unknown>(
				"/warehouses",
				this.toWritePayload(payload),
			);
			this.assertSuccess(data, "No se pudo crear el almacen inicial.");
			return this.normalizeWarehouse(this.extractItem<unknown>(data));
		} catch (error) {
			throw new Error(this.resolveCatalogError(error));
		}
	}

	private normalizeWarehouse(input: unknown): WarehouseRecord {
		const source = (input ?? {}) as Record<string, unknown>;
		return warehouseSchema.parse({
			id: source.id ?? null,
			name: source.name ?? "",
			location_details: source.location_details ?? "",
			camp_id: source.camp_id ?? 0,
			admin_id: source.admin_id ?? null,
		});
	}

	private toWritePayload(payload: CreateWarehouseInput) {
		return {
			name: payload.name.trim().toUpperCase(),
			location_details: payload.location_details.trim(),
			camp_id: payload.camp_id,
			admin_id: payload.admin_id ?? undefined,
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

export const warehouseService = new CreateCampWarehouseService();