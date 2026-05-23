export type ProductionResourceSummary = {
    id?: number;
    code?: string;
    name?: string;
    description?: string;
    unit?: string;
    unitName?: string;
    unit_name?: string;
    unitOfMeasure?: string;
    unit_of_measure?: string;
};

export type ProductionCampSummary = {
    id?: number;
    code?: string;
    name?: string;
    description?: string;
};

export type ProductionProfessionSummary = {
    id?: number;
    code?: string;
    name?: string;
    description?: string;
    isTemporary?: boolean;
    temporaryUntil?: string | Date | null;
};

export class CampProductionRule {
    camp_id!: number;
    campId?: number;

    profession_id!: number;
    professionId?: number;

    resource_id!: number;
    resourceId?: number;

    effective_date!: Date | string;
    effectiveDate?: Date | string;

    expected_amount!: number;
    expectedAmount?: number;

    end_date?: Date | string | null;
    endDate?: Date | string | null;

    state!: string;

    created_at?: Date | string;
    createdAt?: Date | string;

    camp?: ProductionCampSummary | null;
    profession?: ProductionProfessionSummary | null;
    resource?: ProductionResourceSummary | null;

    constructor(data?: Partial<CampProductionRule>) {
        if (!data) return;

        Object.assign(this, data);

        this.camp_id = data.camp_id ?? data.campId ?? data.camp?.id ?? 0;
        this.campId = data.campId ?? data.camp_id ?? data.camp?.id;

        this.profession_id =
            data.profession_id ?? data.professionId ?? data.profession?.id ?? 0;
        this.professionId =
            data.professionId ?? data.profession_id ?? data.profession?.id;

        this.resource_id =
            data.resource_id ?? data.resourceId ?? data.resource?.id ?? 0;
        this.resourceId =
            data.resourceId ?? data.resource_id ?? data.resource?.id;

        this.effective_date = data.effective_date ?? data.effectiveDate ?? "";
        this.effectiveDate = data.effectiveDate ?? data.effective_date;

        this.expected_amount = data.expected_amount ?? data.expectedAmount ?? 0;
        this.expectedAmount = data.expectedAmount ?? data.expected_amount;

        this.end_date = data.end_date ?? data.endDate ?? null;
        this.endDate = data.endDate ?? data.end_date ?? null;

        this.created_at = data.created_at ?? data.createdAt;
        this.createdAt = data.createdAt ?? data.created_at;

        this.state = data.state ?? "A";
        this.camp = data.camp ?? null;
        this.profession = data.profession ?? null;
        this.resource = data.resource ?? null;
    }
}

export type responseCampProductionRule = CampProductionRule;