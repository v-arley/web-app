export type AchievementConditionLogic = Record<string, unknown>;

export class Achievement {
  id!: number;
  code!: string;
  name!: string;
  description?: string | null;
  iconUrl?: string | null;
  icon_url?: string | null;
  conditionLogic?: AchievementConditionLogic | null;
  condition_logic?: AchievementConditionLogic | null;
  points?: number;
  requiredPoints?: number;
  category?: string | null;
  state!: "A" | "I";
  createdAt?: Date | string;
  created_at?: Date | string;

  unlockedAt?: Date | string;
  currentPoints?: number;
  missingPoints?: number;

  constructor(data?: Partial<Achievement>) {
    Object.assign(this, data);

    this.id = data?.id ?? 0;
    this.code = data?.code ?? "";
    this.name = data?.name ?? "";
    this.description = data?.description ?? null;
    this.iconUrl = data?.iconUrl ?? data?.icon_url ?? null;
    this.icon_url = data?.icon_url ?? data?.iconUrl ?? null;
    this.conditionLogic = data?.conditionLogic ?? data?.condition_logic ?? null;
    this.condition_logic =
      data?.condition_logic ?? data?.conditionLogic ?? null;
    this.points = data?.points ?? data?.requiredPoints ?? 0;
    this.requiredPoints = data?.requiredPoints ?? data?.points ?? 0;
    this.category = data?.category ?? null;
    this.state = data?.state ?? "A";
    this.createdAt = data?.createdAt ?? data?.created_at;
    this.created_at = data?.created_at ?? data?.createdAt;
    this.unlockedAt = data?.unlockedAt;
    this.currentPoints = data?.currentPoints;
    this.missingPoints = data?.missingPoints;
  }
}

export type AchievementPage = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: Achievement[];
};

export type responseAchievement = Achievement;
