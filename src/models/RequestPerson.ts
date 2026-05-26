export class RequestPerson {

    id?: number | null;

    request_id!: number;
    person_id!: number;

    constructor(data?: Partial<RequestPerson>) {
        Object.assign(this, data);
    }

}

export type CreateRequestPerson = Omit<RequestPerson, "id">;

export type responseRequestPerson = RequestPerson;