import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskService } from "../../../../services/TaskService";
import type { CreateTask } from "../../../../models/Task";
import { TASKS_QUERY_KEY } from "./useTasksQuery";

const taskService = new TaskService();

export function useCreateTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTask) => taskService.save(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
        },
    });
}
