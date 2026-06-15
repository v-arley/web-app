export type TaskPriority = "L" | "M" | "H";
export type TaskDifficulty = "L" | "M" | "H";
export type TaskAssignmentState = "assigned" | "in_progress" | "completed";

type TaskPayload = Partial<Task> & {
    title?: string;
    estimated_hours?: string | number;
    estimatedMinutes?: number;
    estimated_minutes?: number;
    campId?: number;
    camp_id?: number;
};

export type WorkerTaskAssignment = {
    state?: TaskAssignmentState | string;
    assignedAt?: string | Date;
    completedAt?: string | Date | null;
    assigned_at?: string | Date;
    completed_at?: string | Date | null;
};

export type WorkerTaskCompletePoints = {
    userId?: number;
    user_id?: number;
    totalPoints?: number;
    total_points?: number;
    level?: number;
    updatedAt?: string | Date;
    updated_at?: string | Date;
};

export type WorkerTaskUnlockedAchievement = {
    achievementId?: number;
    achievement_id?: number;
    unlockedAt?: string | Date;
    unlocked_at?: string | Date;
};

export type WorkerTaskCompleteResponse = {
    taskId: number;
    personId: number;
    taskName: string;
    difficulty?: TaskDifficulty | string;
    state: TaskAssignmentState | string;
    completedAt?: string | Date | null;
    alreadyCompleted: boolean;
    pointsAwarded: number;
    points?: WorkerTaskCompletePoints | null;
    unlockedAchievements?: WorkerTaskUnlockedAchievement[];
};

export class Task {
    id!: number;

    camp_id?: number;
    campId?: number;

    name!: string;
    title!: string;

    description?: string;
    type?: string;

    priority?: TaskPriority | string;
    difficulty?: TaskDifficulty | string;

    estimated_minutes?: number;
    estimatedMinutes?: number;
    estimated_hours?: string;

    created_at?: Date | string;
    createdAt?: Date | string;

    updated_at?: Date | string | null;
    updatedAt?: Date | string | null;

    assignment?: WorkerTaskAssignment;

    constructor(data?: TaskPayload) {
        if (!data) return;

        Object.assign(this, data);

        this.id = data.id ?? 0;

        this.camp_id = data.camp_id ?? data.campId;
        this.campId = data.campId ?? data.camp_id;

        this.name = data.name ?? data.title ?? "";
        this.title = data.title ?? data.name ?? "";

        this.description = data.description ?? "";
        this.type = data.type ?? "";

        this.priority = data.priority;
        this.difficulty = data.difficulty;

        this.estimated_minutes =
            data.estimated_minutes ??
            data.estimatedMinutes ??
            this.parseEstimatedHours(data.estimated_hours);

        this.estimatedMinutes =
            data.estimatedMinutes ??
            data.estimated_minutes ??
            this.estimated_minutes;

        this.estimated_hours =
            data.estimated_hours !== undefined
                ? String(data.estimated_hours)
                : this.estimated_minutes !== undefined
                    ? String(Math.round(this.estimated_minutes / 60))
                    : "";

        this.created_at = data.created_at ?? data.createdAt;
        this.createdAt = data.createdAt ?? data.created_at;

        this.updated_at = data.updated_at ?? data.updatedAt ?? null;
        this.updatedAt = data.updatedAt ?? data.updated_at ?? null;

        this.assignment = data.assignment;
    }

    private parseEstimatedHours(value?: string | number): number | undefined {
        if (value === undefined || value === null || value === "") return undefined;

        const numericValue = Number(value);
        if (Number.isNaN(numericValue)) return undefined;

        return numericValue * 60;
    }
}

export type CreateTask = {
    camp_id?: number;
    campId?: number;
    name?: string;
    title?: string;
    description?: string;
    type?: string;
    priority?: TaskPriority | string;
    difficulty?: TaskDifficulty | string;
    estimated_minutes?: number;
    estimatedMinutes?: number;
    estimated_hours?: string | number;
};

export type UpdateTask = Partial<CreateTask>;

export type responseTask = Task;