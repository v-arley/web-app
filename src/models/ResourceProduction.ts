export class ResourceProduction {

    id?: number | null;
    amount!: number;
    production_date!: Date;
    created_at?: Date;

    person_id!: number;
    warehouse_id!: number;
    resource_id!: number;

    constructor(data?: Partial<ResourceProduction>) {
        Object.assign(this, data);
    }

}

export type CreateResourceProduction = Omit<ResourceProduction, "id" | "created_at">;

export type responseResourceProduction = ResourceProduction;