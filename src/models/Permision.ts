
export class Permission {

    id!: number;
    code!: string;
    name!: string;
    description!: string;

    constructor(data: Partial<Permission>) {
        Object.assign(this, data);
    }
}

export type CreatePermission = Omit<Permission, "id">
export type UpdatePermission = Partial<Omit<Permission, "id">>;

export type responsePermission = Permission;