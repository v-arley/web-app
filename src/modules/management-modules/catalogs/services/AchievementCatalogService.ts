import { AxiosBaseService } from "../../../../shared/utils/AxiosBaseService";
import type { BackendListPayload, BackendResponse } from "../../../../shared/utils/Response";
import { achievementSchema, type AchievementFormValues } from "../schemas/achievement.schema";

const CONTRACT_ERROR_MESSAGE = "El endpoint aun no existe o el contrato no es valido.";

export class AchievementCatalogService extends AxiosBaseService {
    async getAchievements(): Promise<AchievementFormValues[]> {
        try {
            const { data } = await this.client.get< BackendResponse<BackendListPayload<unknown>> | unknown[] >("/achievements");
            const items = this.extractItems<unknown>(data);
            
            return items.map((item) => this.normalizeAchievement(item));
        } catch (error) {
            throw new Error(this.resolveCatalogError(error));
        }
    }

    async createAchievement(payload: AchievementFormValues): Promise<AchievementFormValues> {
        try {
            const { data } = await this.client.post< BackendResponse<{ item: unknown }> | unknown >("/achievements", this.toWritePayload(payload));
            
            return this.normalizeAchievement(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveCatalogError(error));
        }
    }

    async updateAchievement(id: number, payload: Partial<AchievementFormValues>): Promise<AchievementFormValues> {
        try {
            const { data } = await this.client.put< BackendResponse<{ item: unknown }> | unknown >(`/achievements/${id}`, this.toWritePayload(payload));
            
            return this.normalizeAchievement(this.extractItem<unknown>(data));
        } catch (error) {
            throw new Error(this.resolveCatalogError(error));
        }
    }

    async removeAchievement(id: number): Promise<void> {
        try {
            await this.client.delete(`/achievements/${id}`);
        } catch (error) {
            throw new Error(this.resolveCatalogError(error));
        }
    }

    private normalizeAchievement(input: unknown): AchievementFormValues {
        const source = (input ?? {}) as Record<string, unknown>;
        return achievementSchema.parse({
            id: source.id ?? null,
            code: source.code ?? "",
            name: source.name ?? "",
            description: source.description ?? "",
            icon_url: source.icon_url ?? "",
            condition_logic:
                typeof source.condition_logic === "string"
                    ? source.condition_logic
                    : JSON.stringify(source.condition_logic ?? {}, null, 2),
            points: Number(source.points ?? 0),
            category: source.category ?? "",
            state: source.state ?? "A",
            created_at: source.created_at ?? null,
        });
    }

    private toWritePayload(payload: Partial<AchievementFormValues>) {
        let parsedCondition: unknown = payload.condition_logic?.trim() ?? "";
        try {
            parsedCondition = JSON.parse(payload.condition_logic ?? "");
        } catch {
            parsedCondition = payload.condition_logic?.trim() ?? "";
        }

        return {
            code: payload.code?.trim().toUpperCase(),
            name: payload.name?.trim(),
            description: payload.description?.trim() || "",
            icon_url: payload.icon_url?.trim() || "",
            condition_logic: parsedCondition,
            points: payload.points,
            category: payload.category?.trim().toUpperCase() || "",
            state: payload.state,
        };
    }

    private resolveCatalogError(error: unknown) {
        const extracted = this.extractErrorMessage(error, CONTRACT_ERROR_MESSAGE).trim();
        if (!extracted || extracted.includes("404") || extracted.includes("Cannot")) {
            return CONTRACT_ERROR_MESSAGE;
        }
        return extracted;
    }
}

export const achievementCatalogService = new AchievementCatalogService();

