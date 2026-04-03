
export class Ration {

    id!: number;
    completed!: boolean;
    person_id!: number; // [!]    

    constructor(data?: Partial<Ration>) {
        Object.assign(this, data);
    }

}

export type CreateRation = Omit<Ration, "id">;
export type UpdateRation = Partial<Omit<Ration, "id">>;

export type responseRation = Ration;