
export class Resource {

    id!: number;
    code!: string;
    name!: string;
    description!: string;
    consumable!: boolean;
    category!: string;
    unitOfMeasure!: string;

    constructor(data?: Partial<Resource> & { unit_of_measure?: string }) {
        if (!data) return;
        this.id = data.id!;
        this.code = data.code ?? "";
        this.name = data.name ?? "";
        this.description = data.description ?? "";
        this.consumable = data.consumable ?? false;
        this.category = data.category ?? "";
        
        // El backend envía unit_of_measure; soportamos ambas formas
        this.unitOfMeasure = data.unitOfMeasure ?? data.unit_of_measure ?? "";
    }
}

export type CreateResource = Omit<Resource, "id">;
export type UpdateResource = Partial<Omit<Resource, "id">>;

export type responseResource = Resource;