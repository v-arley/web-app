import { useQuery } from "@tanstack/react-query";
import { TaskPersonService } from "../../../../services/TaskPersonService";
import type { TaskPerson } from "../../../../models/TaskPerson";

const taskPersonService = new TaskPersonService();

export const TASK_ASSIGNMENTS_QUERY_KEY = ["resource-management-modules", "task-management", "assignments"] as const;

export function useTaskAssignmentsQuery(taskId: number, enabled = true) {
    return useQuery({
        queryKey: [...TASK_ASSIGNMENTS_QUERY_KEY, taskId],
        queryFn: async () => {
            const response = await taskPersonService.findByTaskId(taskId);
            return response.getResultado<TaskPerson[]>("registros") ?? [];
        },
        enabled: enabled && taskId > 0,
    });
}
