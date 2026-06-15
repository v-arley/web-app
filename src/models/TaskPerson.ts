
export class TaskPerson {

    id?: number;
    state?: string;
    completed_at?: Date;
    assigned_at?: Date;

    task_id!: number;
    person_id!: number;

    constructor(data?: Partial<TaskPerson>) {
        Object.assign(this, data);
    }
}

export type CreateTaskPerson = Omit<TaskPerson, "id">

export type responseTaskPerson = TaskPerson;
