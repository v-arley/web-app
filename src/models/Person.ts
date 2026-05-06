export class Person {

    id?: number;
    dni!: string;
    name!: string;
    last_name!: string;
    surname?: string;
    sex!: string;
    date_birth!: Date;
    date_of_birth?: Date;
    photo!: string;
    description!: string;
    state!: string;
    camp_id?: number;
    created_at?: Date;

    conditions?: string;

    constructor(data: Partial<Person>) {
        Object.assign(this, data);
        this.last_name = data.last_name ?? data.surname ?? "";
        this.surname = data.surname ?? data.last_name ?? "";
        this.date_birth = data.date_birth ?? data.date_of_birth ?? new Date();
        this.date_of_birth = data.date_of_birth ?? data.date_birth;
    }

}

export type CreatePerson = {
    dni: string;
    name: string;
    surname: string;
    date_of_birth: string;
    sex: string;
    photo?: string;
    description?: string;
    conditions?: string;
    state?: string;
    camp_id?: number;
};

export type UpdatePerson = Partial<CreatePerson>;

export type responsePerson = Person;
