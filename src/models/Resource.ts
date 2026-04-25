
type ResourcePayload = Partial<Omit<Resource, "consumable">> & {
    unit_of_measure?: string;
    consumable?: boolean | string;
};

export class Resource {

    id!: number;
    code!: string;
    name!: string;
    description!: string;
    consumable!: boolean;
    category!: string;
    unitOfMeasure!: string;
    status?: 'C' | 'M' | 'O'; // C = Critical, M = Moderate, O = Ok
    state!: 'A' | 'I'; // A = Active, I = Inactive

    constructor(data?: ResourcePayload) {
        if (!data) return;
        this.id = data.id!;
        this.code = data.code ?? "";
        this.name = data.name ?? "";
        this.description = data.description ?? "";
        this.consumable = data.consumable === true || data.consumable === "Y";
        this.category = data.category ?? "";
        this.status = data.status;
        this.state = data.state ?? "A";

        // El backend envía unit_of_measure; soportamos ambas formas
        this.unitOfMeasure = data.unitOfMeasure ?? data.unit_of_measure ?? "";
    }
}

export type CreateResource = Omit<Resource, "id">;
export type UpdateResource = Partial<CreateResource>;

export type responseResource = Resource;

// // clase auxiliar para crear un recurso vacío y convertir uno existente a formato de actualización
// import { Resource, type UpdateResource } from "../models/Resource";

// export function createEmptyResource(): Resource {
//     return new Resource({
//         id: 0,
//         code: "",
//         name: "",
//         description: "",
//         consumable: false,
//         category: "",
//         unitOfMeasure: "",
//         state: "A",
//     });
// }

// export function toUpdateResource(resource: Resource): UpdateResource {
//     return {
//         code: resource.code,
//         name: resource.name,
//         category: resource.category,
//         unitOfMeasure: resource.unitOfMeasure,
//         description: resource.description,
//         consumable: resource.consumable,
//         status: resource.status,
//         state: resource.state,
//     };
// }
