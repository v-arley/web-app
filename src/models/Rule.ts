export class Rule {

    id!: number;
    name!: string;
    description!: string;

    constructor(data?: Partial<Rule>) {
        if (!data) return;
        this.id = data.id!;
        this.name = data.name ?? "";
        this.description = data.description ?? "";
    }
}

export type CreateRule = Omit<Rule, "id">;
export type UpdateRule = Partial<Omit<Rule, "id">>;
