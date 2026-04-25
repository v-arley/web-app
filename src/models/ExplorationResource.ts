export class ExplorationResource {

    id?: number;
    amountCollected?: number;
    amountConsumed?: number;
    observations?: string;

    exploration!: string;
    resource!: string;

    constructor(data?: Partial<ExplorationResource>) {
        Object.assign(this, data);
    }

}

export type CreateExplorationResource = Omit<ExplorationResource, "id">;

export type responseExplorationResource = ExplorationResource;