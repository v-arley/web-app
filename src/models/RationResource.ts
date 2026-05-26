export type RationResourceSummary = {
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

type RationResourcePayload = Partial<RationResource> & {
    id?: number;
    code?: string;
    name?: string;
    unitOfMeasure?: string;
    unit_of_measure?: string;
};

export class RationResource {
    id?: number;

    amount!: number;
    quantity?: number;

    ration_id!: number;
    rationId?: number;

    resource_id!: number;
    resourceId?: number;

    resource?: RationResourceSummary | null;

    code?: string;
    name?: string;
    unitOfMeasure?: string;
    unit_of_measure?: string;

    constructor(data?: RationResourcePayload) {
        if (!data) return;

        Object.assign(this, data);

        this.amount = data.amount ?? data.quantity ?? 0;
        this.quantity = data.quantity ?? data.amount;

        this.ration_id = data.ration_id ?? data.rationId ?? 0;
        this.rationId = data.rationId ?? data.ration_id;

        this.resource_id =
            data.resource_id ??
            data.resourceId ??
            data.resource?.id ??
            data.id ??
            0;

        this.resourceId =
            data.resourceId ??
            data.resource_id ??
            data.resource?.id ??
            data.id;

        this.resource =
            data.resource ??
            {
                id: data.id,
                code: data.code,
                name: data.name,
                unitOfMeasure: data.unitOfMeasure,
                unit_of_measure: data.unit_of_measure,
            };
    }
}

export type CreateRationResource = {
    ration_id: number;
    resource_id: number;
    amount: number;
};

export type responseRationResource = RationResource;