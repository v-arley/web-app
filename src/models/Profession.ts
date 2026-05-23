import type { Resource } from "./Resource";

export class Profession {
    id?: number;
    code!: string;
    name!: string;
    description?: string | null;
    default_production_amount?: number | null;
    state!: "A" | "I";
    created_at?: Date | string;
    default_resource_id?: number | null;
    defaultResource?: Resource | null;

    constructor(data?: Partial<Profession>) {
        Object.assign(this, data);
    }
}

export type CreateProfession = {
    code: string;
    name: string;
    description?: string | null;
    default_production_amount?: number | null;
    state?: "A" | "I";
    default_resource_id?: number | null;
};

export type UpdateProfession = Partial<CreateProfession>;

export type responseProfession = Profession;