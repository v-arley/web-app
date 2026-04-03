export class User {

    id?: number;
    name!: string;
    password!: string;
    active?: boolean;
    profession?: string;

    constructor(data: Partial<User>) {
        Object.assign(this, data);
    }
}

export type CreateUser = Omit<User, "id">;
export type UpdateUser = Partial<Omit<User, "id">>;

export type responseUser = User;