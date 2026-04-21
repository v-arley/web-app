
export class CampRequest {

    id?: number | null;
    request_type!: string;
    status!: string;
    description?: string;
    created_at?: Date;
    resolved_at?: Date;

    origin_camp_id!: number;
    destination_camp_id!: number;

    constructor(data?: Partial<CampRequest>) {
        Object.assign(this, data);
    }

}

export type CreateCampRequest = Omit<CampRequest, "id" | "created_at" | "resolved_at">;;

export type responseCampRequest = CampRequest;