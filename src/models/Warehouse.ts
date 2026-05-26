
export class Warehouse {
    id!: number;
    name!: string;
    location_details!: string;

    camp_id!: number;
    admin_id?: number;

    constructor(data?: Partial<Warehouse>) {
        Object.assign(this, data);
    }
}

export type CreateWarehouse = Omit<Warehouse, "id" | "created_at">;
export type UpdateWarehouse = Partial<Omit<Warehouse, "id" | "created_at">>;

export type responseWarehouse = Warehouse;
