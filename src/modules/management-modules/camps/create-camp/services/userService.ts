import { AxiosBaseService } from "../../../../../services/AxiosBaseService";
import type { BackendListPayload, BackendResponse } from "../../../../../utils/Response";
import { adminCandidateSchema, userSchema, type CampAdminOption, type UserRecord } from "../schemas/user.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aun no existe o el contrato no es valido.";

export class CreateCampUserService extends AxiosBaseService {
	async getUsers(): Promise<UserRecord[]> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>("/users");
			const items = this.extractItems<unknown>(data);
			return items.map((item) => this.normalizeUser(item));
		} catch (error) {
			throw new Error(this.resolveCatalogError(error));
		}
	}

	async getAdminCandidates(selectedCampId?: number | null): Promise<CampAdminOption[]> {
		try {
			const params = selectedCampId != null ? { selectedCampId } : undefined;
			const { data } = await this.client.get<BackendResponse<BackendListPayload<unknown>> | unknown[]>(
				"/users/admin-candidates",
				{ params },
			);
			const items = this.extractItems<unknown>(data);
			return items.map((item) => this.normalizeAdminCandidate(item));
		} catch (error) {
			throw new Error(this.resolveCatalogError(error));
		}
	}

	private normalizeUser(input: unknown): UserRecord {
		const source = (input ?? {}) as Record<string, unknown>;
		return userSchema.parse({
			id: source.id ?? null,
			username: source.username ?? source.name ?? "",
			name: source.name ?? source.username ?? "",
			profession: source.profession ?? null,
			state: source.state ?? "A",
		});
	}

	private normalizeAdminCandidate(input: unknown): CampAdminOption {
		const source = (input ?? {}) as Record<string, unknown>;
		return adminCandidateSchema.parse({
			id: source.id,
			label: source.label ?? source.username ?? source.name ?? "",
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

export const userService = new CreateCampUserService();