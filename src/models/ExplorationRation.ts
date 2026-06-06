export class ExplorationRation {
    exploration_id!: number;
    resource_id!: number;
    planned_amount!: number;
    consumed_amount!: number;
    notes?: string;

    constructor(data?: Partial<ExplorationRation>) {
        Object.assign(this, data);
    }
}