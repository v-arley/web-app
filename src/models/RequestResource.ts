
export class RequestResource {

    id?: number | null;
    amount!: number;

    request_id!: number;
    resource_id!: number;

    constructor(data?: Partial<RequestResource>) {
        Object.assign(this, data);
    }

}

export type CreateRequestResource = Omit<RequestResource, "id">;

export type responseRequestResource = RequestResource;