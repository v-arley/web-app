
export class TaskResource {

    id?: number;
    amount?: number;

    task_id!: number;
    resource_id!: number;

    constructor(data?: Partial<TaskResource>) {
        Object.assign(this, data);
    }
}

export type CreateTaskResource = Omit<TaskResource, "id">

export type responseTaskResource = TaskResource;