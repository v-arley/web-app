
export class RationResource {

    id?: number;
    amount!: number;

    ration_id!: number;
    resource_id!: number;

    constructor(data?: Partial<RationResource>) {
        Object.assign(this, data);
    }
}

export type CreateRationResource = Omit<RationResource, "id">;

export type responseRationResource = RationResource;