export class PersonProfession {
    person_id!: number;
    profession_id!: number;
    assigned_at?: string | Date;
    is_temporary!: "Y" | "N";
    temporary_until?: string | null;
    assigned_by?: number | null;

    constructor(data: Partial<PersonProfession>) {
        Object.assign(this, data);
    }
}

export type CreatePersonProfession = {
    person_id: number;
    profession_id: number;
    assigned_at?: string;
    is_temporary?: "Y" | "N";
    temporary_until?: string | null;
    assigned_by?: number | null;
};

export type UpdatePersonProfession = Partial<CreatePersonProfession>;

export type responsePersonProfession = PersonProfession;