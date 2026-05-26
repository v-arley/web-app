export class ResourceAlert {

    id?: number | null;
    current_amount!: number;
    min_quantity!: number;
    alert_date?: Date;
    resolved!: string;
    resolved_at?: Date;

    resource_id!: number;
    warehouse_id!: number;

    constructor(data?: Partial<ResourceAlert>) {
        Object.assign(this, data);
    }

}

export type CreateResourceAlert = Omit<ResourceAlert, "id" | "alert_date" | "resolved_at">;

export type responseResourceAlert = ResourceAlert;