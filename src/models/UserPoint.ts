export class UserPoint {
  userId!: number;
  totalPoints!: number;
  level!: number;
  currentLevelMin!: number;
  nextLevelMin!: number;
  progressToNextLevel!: number;
  progressPercentage!: number;
  updatedAt!: Date | string;

  user_id?: number;
  total_points?: number;
  current_level_min?: number;
  next_level_min?: number;
  progress_to_next_level?: number;
  progress_percentage?: number;
  updated_at?: Date | string;

  constructor(data?: Partial<UserPoint>) {
    Object.assign(this, data);

    this.userId = data?.userId ?? data?.user_id ?? 0;
    this.totalPoints = data?.totalPoints ?? data?.total_points ?? 0;
    this.level = data?.level ?? 1;
    this.currentLevelMin =
      data?.currentLevelMin ?? data?.current_level_min ?? 0;
    this.nextLevelMin = data?.nextLevelMin ?? data?.next_level_min ?? 100;
    this.progressToNextLevel =
      data?.progressToNextLevel ??
      data?.progress_to_next_level ??
      this.totalPoints;
    this.progressPercentage =
      data?.progressPercentage ?? data?.progress_percentage ?? 0;
    this.updatedAt = data?.updatedAt ?? data?.updated_at ?? "";
  }
}

export type responseUserPoint = UserPoint;
