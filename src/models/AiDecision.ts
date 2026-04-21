
export class AiDecision {

    id?: number | null;
    decision_status!: string;
    explanation!: string;
    created_at?: Date;

    admission_request_id!: number;

    constructor(data?: Partial<AiDecision>) {
        Object.assign(this, data);
    }

}

export type CreateAiDecision = Omit<AiDecision, "id" | "created_at">;
export type UpdateAiDecision = Partial<Omit<AiDecision, "id" | "created_at">>;

export type responseAiDecision = AiDecision;