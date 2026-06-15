import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskPersonService } from "../../../../services/TaskPersonService";
import type { CreateTaskPerson } from "../../../../models/TaskPerson";
import { TASK_ASSIGNMENTS_QUERY_KEY } from "./useTaskAssignmentsQuery";

const taskPersonService = new TaskPersonService();

export function useTaskAssignmentMutation() {
    const queryClient = useQueryClient();

    const assign = useMutation({
        mutationFn: (data: CreateTaskPerson) => taskPersonService.save(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASK_ASSIGNMENTS_QUERY_KEY });
        },
    });

    const unassign = useMutation({
        mutationFn: ({ taskId, personId }: { taskId: number; personId: number }) =>
            taskPersonService.remove(taskId, personId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASK_ASSIGNMENTS_QUERY_KEY });
        },
    });

    return { assign, unassign };
}
