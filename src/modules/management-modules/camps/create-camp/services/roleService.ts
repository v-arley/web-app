import { AxiosBaseService } from "../../../../../services/AxiosBaseService";
import type { BackendListPayload, BackendResponse } from "../../../../../utils/Response";
import { roleSchema, type RoleRecord } from "../schemas/role.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aun no existe o el contrato no es valido.";

export class CreateCampRoleService extends AxiosBaseService {
	async getRoles(): Promise<RoleRecord[]> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>("/roles");
			const items = this.extractItems<unknown>(data);
			return items.map((item) => this.normalizeRole(item));
		} catch (error) {
			throw new Error(this.resolveCatalogError(error));
		}
	}

	private normalizeRole(input: unknown): RoleRecord {
		const source = (input ?? {}) as Record<string, unknown>;
		return roleSchema.parse({
			id: source.id ?? null,
			name: source.name ?? "",
			description: source.description ?? null,
		});
	}

	private resolveCatalogError(error: unknown) {
		const extracted = this.extractErrorMessage(error, CONTRACT_ERROR_MESSAGE).trim();
		if (!extracted || extracted.includes("404") || extracted.includes("Cannot")) {
			return CONTRACT_ERROR_MESSAGE;
		}
		return extracted;
	}
}

export const roleService = new CreateCampRoleService();