import type { Person } from "./Person";

export class User {

    id?: number;
    name?: string;
    username?: string;
    password?: string;
    active?: boolean;
    state?: string;
    profession?: string;
    person_id?: number;
    roles?: string[];
    person?: Person;
    created_at?: Date;

    constructor(data: Partial<User>) {
        Object.assign(this, data);
    }
}

export type CreateUser = Omit<User, "id" | "created_at" | "person" | "name">;
export type UpdateUser = Partial<Omit<User, "id" | "created_at" | "person">>;

export type responseUser = User;
