import type { Achievement, AchievementConditionLogic } from "../../../../models/Achievement";

export type AchievementCatalogRecord = Achievement;

export type AchievementCatalogFormValues = {
    code: string;
    name: string;
    description?: string | null;
    iconUrl?: string | null;
    conditionLogic?: AchievementConditionLogic | null;
    points?: number;
    category?: string | null;
    state?: "A" | "I";
};

export type AchievementCatalogUpdateValues = Partial<AchievementCatalogFormValues>;

export const EMPTY_ACHIEVEMENT_FORM: AchievementCatalogFormValues = {
    code: "",
    name: "",
    description: "",
    iconUrl: "",
    conditionLogic: null,
    points: 0,
    category: "",
    state: "A",
};
