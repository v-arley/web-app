import { useCallback, useEffect, useState } from "react";
import { TaskService } from "../services/TaskService";
import { Task, type WorkerTaskCompleteResponse } from "../models/Task";

const taskService = new TaskService();

export function useWorkerTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastCompleted, setLastCompleted] =
        useState<WorkerTaskCompleteResponse | null>(null);
    const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);

    const loadTasks = useCallback(async () => {
        setLoading(true);
        setError(null);

        const response = await taskService.findWorkerTasks();

        if (!response.getEstado()) {
            setTasks([]);
            setError(response.getMensaje() || "No se pudieron cargar las tareas.");
            setLoading(false);
            return;
        }

        setTasks(response.getResultado<Task[]>("registros") ?? []);
        setLoading(false);
    }, []);

    const completeTask = useCallback(
        async (taskId: number) => {
            setCompletingTaskId(taskId);
            setError(null);

            const response = await taskService.completeWorkerTask(taskId);

            if (!response.getEstado()) {
                setError(response.getMensaje() || "No se pudo completar la tarea.");
                setCompletingTaskId(null);
                return null;
            }

            const result =
                response.getResultado<WorkerTaskCompleteResponse>("registro") ?? null;

            setLastCompleted(result);
            setCompletingTaskId(null);

            await loadTasks();

            return result;
        },
        [loadTasks],
    );

    useEffect(() => {
        let cancelled = false;

        void Promise.resolve().then(async () => {
            if (!cancelled) {
                await loadTasks();
            }
        });

        return () => {
            cancelled = true;
        };
    }, [loadTasks]);

    return {
        tasks,
        loading,
        error,
        lastCompleted,
        completingTaskId,
        reload: loadTasks,
        completeTask,
        clearLastCompleted: () => setLastCompleted(null),
    };
}