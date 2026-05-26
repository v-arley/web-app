import type { ProductionResourceSummary } from "./CampProductionRule";

export class ResourceProduction {
    id?: number | null;

    amount!: number;

    production_date!: Date | string;
    productionDate?: Date | string;

    created_at?: Date | string;
    createdAt?: Date | string;

    person_id!: number;
    personId?: number;

    warehouse_id!: number;
    warehouseId?: number;

    resource_id!: number;
    resourceId?: number;

    resource?: ProductionResourceSummary | null;

    constructor(data?: Partial<ResourceProduction>) {
        if (!data) return;

        Object.assign(this, data);

        this.amount = data.amount ?? 0;

        this.production_date = data.production_date ?? data.productionDate ?? "";
        this.productionDate = data.productionDate ?? data.production_date;

        this.created_at = data.created_at ?? data.createdAt;
        this.createdAt = data.createdAt ?? data.created_at;

        this.person_id = data.person_id ?? data.personId ?? 0;
        this.personId = data.personId ?? data.person_id;

        this.warehouse_id = data.warehouse_id ?? data.warehouseId ?? 0;
        this.warehouseId = data.warehouseId ?? data.warehouse_id;

        this.resource_id = data.resource_id ?? data.resourceId ?? 0;
        this.resourceId = data.resourceId ?? data.resource_id;
    }
}

export type CreateWorkerResourceProduction = {
    resourceId: number;
    amount: number;
    productionDate?: string;
};

export type WorkerProductionHistoryItem = {
    id: number;
    amount: number;

    productionDate?: string | Date;
    production_date?: string | Date;

    createdAt?: string | Date;
    created_at?: string | Date;

    resourceId?: number;
    resource_id?: number;

    warehouseId?: number;
    warehouse_id?: number;

    personId?: number;
    person_id?: number;

    resource?: ProductionResourceSummary | null;

    expectedAmount?: number;
    expected_amount?: number;

    difference?: number;
    achieved?: boolean;
};

export type WorkerProductionHistoryPage = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    items: WorkerProductionHistoryItem[];
};

export type WorkerProductionResult = {
    id?: number;
    amount: number;

    productionDate?: string | Date;
    production_date?: string | Date;

    createdAt?: string | Date;
    created_at?: string | Date;

    expectedAmount?: number;
    expected_amount?: number;

    achieved?: boolean;
    difference?: number;

    pointsAwarded?: number;
    points_awarded?: number;

    points?: {
        userId?: number;
        user_id?: number;
        totalPoints?: number;
        total_points?: number;
        level?: number;
        updatedAt?: string | Date;
        updated_at?: string | Date;
    } | null;

    unlockedAchievements?: {
        achievementId?: number;
        achievement_id?: number;
        unlockedAt?: string | Date;
        unlocked_at?: string | Date;
    }[];
};