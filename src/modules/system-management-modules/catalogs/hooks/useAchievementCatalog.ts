import { useSystemCrud } from "../../shared/hooks/useSystemCrud";
import { achievementCatalogService } from "../services/achievementCatalogService";
import type { AchievementCatalogFormValues, AchievementCatalogRecord, AchievementCatalogUpdateValues } from "../schemas/achievement.schema";

export const ACHIEVEMENT_CATALOG_QUERY_KEY = ["system-management-modules", "catalogs", "achievements"] as const;

export function useAchievementCatalog() {
    return useSystemCrud<AchievementCatalogRecord, AchievementCatalogFormValues, AchievementCatalogUpdateValues>(
        ACHIEVEMENT_CATALOG_QUERY_KEY,
        achievementCatalogService,
    );
}
