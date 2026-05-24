import { useQuery } from "@tanstack/react-query";
import type { AchievementFormValues } from "../schemas/achievement.schema";
import { achievementCatalogService } from "../services/AchievementCatalogService";

export const ACHIEVEMENTS_QUERY_KEY = ["management-modules", "catalogs", "achievements"] as const;

export function useAchievementQuery(enabled = true) {
    const query = useQuery<AchievementFormValues[], Error>({
        queryKey: ACHIEVEMENTS_QUERY_KEY,
        queryFn: () => achievementCatalogService.getAchievements(),
        enabled,
    });

    return { query };
}
