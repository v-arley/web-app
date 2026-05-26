import type { Person } from "./Person";
import type { Profession } from "./Profession";
import type { User } from "./User";

export class PersonProfession {
    person_id!: number;
    profession_id!: number;
    assigned_at?: Date | string;
    is_temporary!: "Y" | "N";
    temporary_until?: Date | string | null;
    assigned_by?: number | null;

    person?: Person;
    profession?: Profession;
    assignedBy?: User | null;

    constructor(data?: Partial<PersonProfession>) {
        if (!data) return;
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

export type WorkerProfessionAssignment = {
    id: number;
    code: string;
    name: string;
    assignedAt?: Date | string;
    temporaryUntil?: Date | string | null;
    assignedBy?: number | null;
};

export type WorkerProfessionSummary = {
    base: WorkerProfessionAssignment | null;
    temporary: WorkerProfessionAssignment | null;
};

export type responsePersonProfession = PersonProfession;