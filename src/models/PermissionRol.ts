export class PermissionRol {

    permission_id!: number;
    role_id!: number;

    constructor(data?: Partial<PermissionRol>) {
        Object.assign(this, data);
    }
}

export type CreatePermissionRol = PermissionRol;

export type responsePermissionRol = PermissionRol;