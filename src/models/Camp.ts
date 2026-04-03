
export class Camp {

    id?: number | null;
    code!: string;
    description!: string;
    capacity!: number;
    location_x!: number;
    location_y!: number;
    active: boolean = true;
    created_at?: Date;

    user_admin_id?: number;

    constructor(data?: Partial<Camp>) {
        Object.assign(this, data);
    }

}

export type CreateCamp = Omit<Camp, "id" | "created_at">;
export type UpdateCamp = Partial<Omit<Camp, "id" | "created_at">>;

export type responseCamp = Camp;