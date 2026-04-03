
export class Warehouse {
    id!: number;
    name!: string;
    location_details!: string;

    camp_id!: number;  // primary key real de campamento
    persona_id!: number;  // primary key real de persona

    constructor(data?: Partial<Warehouse>) {
        Object.assign(this, data);
    }
}

export type CreateWarehouse = Omit<Warehouse, "id" | "created_at">;
export type UpdateWarehouse = Partial<Omit<Warehouse, "id" | "created_at">>;

export type responseWarehouse = Warehouse;