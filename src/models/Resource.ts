
export class Resource {

    id!: number;
    code!: string;
    name!: string;
    description!: string;
    consumable!: boolean;
    category!: string;
    unit_of_measure!: string;

    constructor(data?: Partial<Resource>) {
        Object.assign(this, data);
    }
}

export type CreateResource = Omit<Resource, "id">;
export type UpdateResource = Partial<Omit<Resource, "id">>;

export type responseResource = Resource;