import type { AchievementFormValues } from "../schemas/achievement.schema";

type UseAchievementTableParams = {
    achievements: AchievementFormValues[];
    selectedId?: number | null;
    onSelect?: (achievement: AchievementFormValues | undefined) => void;
};

export function useAchievementTable({
    achievements,
    selectedId = null,
    onSelect,
}: UseAchievementTableParams) {
    const handleSelect = (achievement: AchievementFormValues) => {
        if (achievement.id === selectedId) {
            onSelect?.(undefined);
            return;
        }

        onSelect?.(achievement);
    };

    return {
        achievements,
        selectedId,
        handleSelect,
    };
}
