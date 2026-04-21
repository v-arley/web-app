
export class AiPrompt {

    id?: number | null;
    prompt!: string;
    response?: string;
    created_at?: Date;

    admission_request_id!: number;

    constructor(data?: Partial<AiPrompt>) {
        Object.assign(this, data);
    }

}

export type CreateAiPrompt = Omit<AiPrompt, "id" | "created_at">;
export type UpdateAiPrompt = Partial<Omit<AiPrompt, "id" | "created_at">>;

export type responseAiPrompt = AiPrompt;