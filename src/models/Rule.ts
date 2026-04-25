export class Rule {
    id!: number;
    camp_id!: number;
    name!: string;
    description!: string;
    condition!: string;
    status!: 'A' | 'I';
    created_at?: Date;

    constructor(data?: Partial<Rule>) {
        if (!data) return;
        this.id = data.id!;
        this.camp_id = data.camp_id!;
        this.name = data.name ?? "";
        this.description = data.description ?? "";
        this.condition = data.condition ?? "";
        this.status = data.status ?? "A";
        this.created_at = data.created_at;
    }
}

export type CreateRule = Omit<Rule, "id" | "created_at">;
export type UpdateRule = Partial<CreateRule>
