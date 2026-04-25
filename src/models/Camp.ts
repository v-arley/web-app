export class Camp {

    id?: number | null;
    code!: string;
    description!: string;
    capacity!: number;
    location_x!: number;
    location_y!: number;
    active?: boolean;
    state?: string;
    created_at?: Date;

    admin_id?: number;
    user_admin_id?: number;

    constructor(data?: Partial<Camp>) {
        Object.assign(this, data);
    }

}

export type CreateCamp = Omit<Camp, "id" | "created_at">;
export type UpdateCamp = Partial<Omit<Camp, "id" | "created_at">>;

export type responseCamp = Camp;
