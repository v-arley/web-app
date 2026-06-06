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

export type CreateAdmissionRequest = {
    person_id: number;
    camp_id: number;
    observations?: string;
};

export type UpdateAdmissionRequest = Partial<{
    person_id: number;
    camp_id: number;
    request_status: string;
    observations?: string;

    role_id: number;
    profession_id: number;
    username: string;
    password: string;
}>;

export type responseAdmissionRequest = AdmissionRequest;