import { AxiosBaseService } from "../../../../../services/AxiosBaseService";
import type { BackendListPayload, BackendResponse } from "../../../../../utils/Response";
import { userRoleSchema, type UserRoleRecord } from "../schemas/user-role.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aun no existe o el contrato no es valido.";

export class CreateCampUserRoleService extends AxiosBaseService {
	async getUserRoles(): Promise<UserRoleRecord[]> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>("/user-roles");
			const items = this.extractItems<unknown>(data);
			return items.map((item) => this.normalizeUserRole(item));
		} catch (error) {
			throw new Error(this.resolveCatalogError(error));
		}
	}

	private normalizeUserRole(input: unknown): UserRoleRecord {
		const source = (input ?? {}) as Record<string, unknown>;
		return userRoleSchema.parse({
			id: source.id ?? null,
			user_id: source.user_id ?? null,
			role_id: source.role_id ?? null,
			status: source.status ?? "A",
			active: source.active ?? true,
			temporal: source.temporal ?? false,
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

export const userRoleService = new CreateCampUserRoleService();