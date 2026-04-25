export class Rule {

    id!: number;
    name!: string;
    description!: string;
    condition!: string;
    status!: 'A' | 'I';

    constructor(data?: Partial<Rule>) {
        if (!data) return;
        this.id = data.id!;
        this.name = data.name ?? "";
        this.description = data.description ?? "";
        this.condition = data.condition ?? "";
        this.status = data.status ?? "A";
    }
}

export type CreateRule = Omit<Rule, "id">;
export type UpdateRule = Partial<Omit<Rule, "id">>
