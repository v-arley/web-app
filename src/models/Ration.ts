import { RationResource } from "./RationResource";

export type RationCompletedState = "Y" | "N";

export type RationCampSummary = {
    id?: number;
    code?: string;
    name?: string;
    description?: string;
};

type RationPayload = Partial<Ration> & {
    sources?: RationResource[];
};

export class Ration {
    id!: number;

    completed!: RationCompletedState | string;

    ration_date?: Date | string;
    rationDate?: Date | string;

    notes?: string | null;

    created_at?: Date | string;
    createdAt?: Date | string;

    person_id!: number;
    personId?: number;

    camp_id!: number;
    campId?: number;

    camp?: RationCampSummary | null;

    rationResources?: RationResource[];
    resources?: RationResource[];
    sources?: RationResource[];

    constructor(data?: RationPayload) {
        if (!data) return;

        Object.assign(this, data);

        this.id = data.id ?? 0;

        this.completed =
            typeof data.completed === "boolean"
                ? data.completed
                    ? "Y"
                    : "N"
                : data.completed ?? "N";

        this.ration_date = data.ration_date ?? data.rationDate;
        this.rationDate = data.rationDate ?? data.ration_date;

        this.created_at = data.created_at ?? data.createdAt;
        this.createdAt = data.createdAt ?? data.created_at;

        this.person_id = data.person_id ?? data.personId ?? 0;
        this.personId = data.personId ?? data.person_id;

        this.camp_id = data.camp_id ?? data.campId ?? data.camp?.id ?? 0;
        this.campId = data.campId ?? data.camp_id ?? data.camp?.id;

        this.notes = data.notes ?? null;
        this.camp = data.camp ?? null;

        const resources =
            data.sources ??
            data.rationResources ??
            data.resources ??
            [];

        this.rationResources = resources.map((item) => new RationResource(item));
        this.resources = this.rationResources;
        this.sources = this.rationResources;
    }
}

export type CreateRation = {
    person_id: number;
    camp_id: number;
    completed?: RationCompletedState | string;
    ration_date?: string | Date;
    notes?: string;
};

export type UpdateRation = Partial<CreateRation>;

export type WorkerRationHistoryPage = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    items: Ration[];
};

export type responseRation = Ration;