export class ExplorationResource {
    exploration_id!: number;
    resource_id!: number;
    amount_collected?: number;
    amount_consumed?: number;
    observations?: string;

    resource?: {
        id?: number;
        code?: string;
        name?: string;
        description?: string;
        category?: string;
        unit_of_measure?: string;
        unitOfMeasure?: string;
        consumable?: boolean | string;
        state?: string;
    };

    exploration?: {
        id?: number;
        code?: string;
        name?: string;
        state?: string;
        camp_id?: number;
    };

    constructor(data?: Partial<ExplorationResource>) {
        Object.assign(this, data);
    }
}

export type CreateExplorationResource = {
    exploration_id: number;
    resource_id: number;
    amount_collected?: number;
    amount_consumed?: number;
    observations?: string;
};

export type responseExplorationResource = ExplorationResource;