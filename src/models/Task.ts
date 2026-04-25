export class Task {

    id!: number
    title!: string
    description!: string
    type!: string
    priority!: string
    difficulty!: string
    estimated_hours!: string
    created_at!: Date
    updated_at!: Date

    constructor(data?: Partial<Task>) {
        Object.assign(this, data);
    }

}

export type CreateTask = Omit<Task, "id" | "created_at" | "updated_at">;
export type UpdateTask = Partial<Omit<Task, "id" | "created_at" | "updated_at">>;

export type responseTask = Task;