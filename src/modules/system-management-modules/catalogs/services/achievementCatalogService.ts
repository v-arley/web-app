import { Achievement } from "../../../../models/Achievement";
import { AxiosBaseService } from "../../../../shared/utils/AxiosBaseService";
import type { BackendListPayload, BackendResponse } from "../../../../shared/utils/Response";
import type { AchievementCatalogFormValues, AchievementCatalogRecord, AchievementCatalogUpdateValues } from "../schemas/achievement.schema";

class AchievementCatalogService extends AxiosBaseService {
    private toBackendPayload(payload: AchievementCatalogFormValues | AchievementCatalogUpdateValues) {
        const { iconUrl, conditionLogic, ...rest } = payload;

        return {
            ...rest,
            ...(iconUrl !== undefined ? { icon_url: iconUrl } : {}),
            ...(conditionLogic !== undefined ? { condition_logic: conditionLogic } : {}),
        };
    }

    async findAll(): Promise<AchievementCatalogRecord[]> {
        const { data } = await this.client.get<BackendResponse<BackendListPayload<Achievement>> | Achievement[]>("/achievements");
        return this.extractItems<Achievement>(data).map((achievement) => new Achievement(achievement));
    }

    async create(payload: AchievementCatalogFormValues): Promise<AchievementCatalogRecord> {
        const { data } = await this.client.post<BackendResponse<{ item: Achievement }> | Achievement>(
            "/achievements",
            this.toBackendPayload(payload),
        );
        return new Achievement(this.extractItem<Achievement>(data));
    }

    async update(id: number, payload: AchievementCatalogUpdateValues): Promise<AchievementCatalogRecord> {
        const { data } = await this.client.put<BackendResponse<{ item: Achievement }> | Achievement>(
            `/achievements/${id}`,
            this.toBackendPayload(payload),
        );
        return new Achievement(this.extractItem<Achievement>(data));
    }

    async remove(id: number): Promise<void> {
        await this.client.delete(`/achievements/${id}`);
    }
}

export const achievementCatalogService = new AchievementCatalogService();
