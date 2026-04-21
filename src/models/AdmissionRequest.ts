
export class AdmissionRequest {

    id?: number | null;
    request_status!: string;
    observations?: string;
    requested_at?: Date;

    person_id!: number;
    camp_id!: number;

    constructor(data?: Partial<AdmissionRequest>) {
        Object.assign(this, data);
    }

}

export type CreateAdmissionRequest = Omit<AdmissionRequest, "id" | "requested_at">;

export type responseAdmissionRequest = AdmissionRequest;