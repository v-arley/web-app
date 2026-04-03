
export class PersonExploration {

    id?: number;
    role?: string;
    assignment_date?: Date;

    exploration!: number;
    person!: number;

    constructor(data?: Partial<PersonExploration>) {
        Object.assign(this, data);
    }
}

export type CreatePersonExploration = Omit<PersonExploration, "id">;

export type responsePersonExploration = PersonExploration;