export class Role {

    id!: number;
    name!: string;
    description!: string;

    constructor(data?: Partial<Role>) {
        Object.assign(this, data);
    }
}

export type CreateRole = Omit<Role, "id">;
export type UpdateRole = Partial<Omit<Role, "id">>;

export type responseRole = Role;