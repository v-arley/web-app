
export class Person {

    id?: number;
    dni!: string;
    name!: string;
    last_name!: string;
    sex!: string;
    date_birth!: Date;
    photo!: string;
    description!: string;
    state!: string;
    created_at?: Date;

    constructor(data: Partial<Person>) {
        Object.assign(this, data);
    }

}

export type CreatePerson = Omit<Person, "id" | "created_at">;
export type UpdatePerson = Partial<Omit<Person, "id" | "created_at">>;

export type responsePerson = Person;