
export class WarehouseResource {

    id?: number;
    amount!: number;
    category!: string;
    min_quantity!: number;
    date_last_movement?: Date;

    warehouse_id!: number;
    resource_id!: number;

    constructor(data?: Partial<WarehouseResource>) {
        Object.assign(this, data);
    }
}

export type CreateWarehouseResource = Omit<WarehouseResource, "id">;

export type responseWarehouseResource = WarehouseResource;