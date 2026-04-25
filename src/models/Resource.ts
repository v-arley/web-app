
export class Resource {

    id!: number;
    code!: string;
    name!: string;
    description!: string;
    consumable!: boolean;
    category!: string;
    unitOfMeasure!: string;
    /** C = Critical, M = Moderate, O = Ok */
    status?: 'C' | 'M' | 'O';
    state!: 'A' | 'I';

    constructor(data?: Partial<Resource> & { unit_of_measure?: string }) {
        if (!data) return;
        this.id = data.id!;
        this.code = data.code ?? "";
        this.name = data.name ?? "";
        this.description = data.description ?? "";
        this.consumable = data.consumable ?? false;
        this.category = data.category ?? "";
        this.status = data.status;
        this.state = data.state ?? "A";

        // El backend envía unit_of_measure; soportamos ambas formas
        this.unitOfMeasure = data.unitOfMeasure ?? data.unit_of_measure ?? "";
    }
}

export type CreateResource = Omit<Resource, "id">;
export type UpdateResource = Partial<Omit<Resource, "id">>;

export type responseResource = Resource;