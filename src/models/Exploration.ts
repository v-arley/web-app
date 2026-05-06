export class Exploration {

    id?: number;
    code!: string;
    name!: string;
    objective!: string;
    notes!: string;
    departure_date!: Date;
    estimated_return_date!: Date;
    duration_days!: number;
    risk_level!: string;
    state!: string;

    camp_id!: number;

    constructor(data?: Partial<Exploration>) {
        Object.assign(this, data);
    }

}

export type CreateExploration = Omit<Exploration, "id">;
export type UpdateExploration = Partial<Omit<Exploration, "id">>;

export type responseExploration = Exploration;