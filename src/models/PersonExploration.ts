export class PersonExploration {
    exploration_id!: number;
    person_id!: number;
    role_name?: string;
    assigned_at?: Date | string;

    person?: {
        id?: number;
        dni?: string;
        name?: string;
        last_name?: string;
        surname?: string;
        state?: string;
        camp_id?: number;
    };

    exploration?: {
        id?: number;
        code?: string;
        name?: string;
        state?: string;
        camp_id?: number;
    };

    constructor(data?: Partial<PersonExploration>) {
        Object.assign(this, data);
    }
}

export type CreatePersonExploration = {
    exploration_id: number;
    person_id: number;
    role_name?: string;
    assigned_at?: Date | string;
};

export type responsePersonExploration = PersonExploration;