import { useQuery } from "@tanstack/react-query";
import { TaskService } from "../../../../services/TaskService";
import type { Task } from "../../../../models/Task";

const taskService = new TaskService();

export const TASKS_QUERY_KEY = ["resource-management-modules", "task-management", "tasks"] as const;

export function useTasksQuery(campId: number, enabled = true) {
    return useQuery({
        queryKey: [...TASKS_QUERY_KEY, campId],
        queryFn: async () => {
            const response = await taskService.findAll();
            const tasks = response.getResultado<Task[]>("registros") ?? [];
            return tasks.filter((t) => (t.camp_id ?? t.campId) === campId);
        },
        enabled: enabled && campId > 0,
    });
}
