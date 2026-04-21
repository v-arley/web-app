
export class CampRule {

    id?: number | null;
    name!: string;
    description?: string;
    condition!: string;
    status!: string;
    created_at?: Date;

    camp_id!: number;

    constructor(data?: Partial<CampRule>) {
        Object.assign(this, data);
    }

}

export type CreateCampRule = Omit<CampRule, "id" | "created_at">;

export type responseCampRule = CampRule;