
export class UserRol {

    assignment_date?: Date;
    active?: boolean;
    temporal?: boolean;
    expires_in?: Date;

    user_id?: number;
    role_id?: number;

    constructor(data?: Partial<UserRol>) {
        Object.assign(this, data);
    }
}

export type CreateUserRol = Omit<UserRol, "id">

export type responseUserRol = UserRol;