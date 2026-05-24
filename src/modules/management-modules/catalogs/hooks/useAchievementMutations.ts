import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AchievementFormValues } from "../schemas/achievement.schema";
import { achievementCatalogService } from "../services/AchievementCatalogService";
import { ACHIEVEMENTS_QUERY_KEY } from "./useAchievementQuery";

export function useAchievementMutations() {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (data: AchievementFormValues) => achievementCatalogService.createAchievement(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ACHIEVEMENTS_QUERY_KEY }),
    });

    const update = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<AchievementFormValues> }) =>
            achievementCatalogService.updateAchievement(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ACHIEVEMENTS_QUERY_KEY }),
    });

    const remove = useMutation({
        mutationFn: (id: number) => achievementCatalogService.removeAchievement(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ACHIEVEMENTS_QUERY_KEY }),
    });

    return { create, update, remove };
}
