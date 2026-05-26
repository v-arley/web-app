export class ResourceMovement {

    id?: number | null;
    movement_type!: string;
    adjustment_sign?: string;
    amount!: number;
    reason?: string;
    created_at?: Date;

    resource_id!: number;
    warehouse_id!: number;

    constructor(data?: Partial<ResourceMovement>) {
        Object.assign(this, data);
    }

}

export type CreateResourceMovement = Omit<ResourceMovement, "id" | "created_at">;

export type responseResourceMovement = ResourceMovement;