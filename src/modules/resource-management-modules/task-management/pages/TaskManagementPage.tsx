import { useState, useMemo } from "react";
import { ClipboardCheck, UserPlus, RefreshCw, AlertTriangle, Plus } from "lucide-react";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { useToast } from "../../../../shared/hooks/useToast";
import { useWorkersQuery } from "../hooks/useWorkersQuery";
import { useTasksQuery } from "../hooks/useTasksQuery";
import { useTaskAssignmentsQuery } from "../hooks/useTaskAssignmentsQuery";
import { useTaskAssignmentMutation } from "../hooks/useTaskAssignmentMutation";
import { WorkersListTable } from "../components/WorkersListTable";
import { TaskSelector } from "../components/TaskSelector";
import { CurrentAssignmentsTable } from "../components/CurrentAssignmentsTable";
import { CreateTaskModal } from "../components/CreateTaskModal";

export function TaskManagementPage() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;
    const { toast } = useToast();

    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [selectedWorkerIds, setSelectedWorkerIds] = useState<number[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: workers = [], isLoading: isLoadingWorkers, refetch: refetchWorkers } = useWorkersQuery(campId);
    const { data: tasks = [], isLoading: isLoadingTasks, refetch: refetchTasks } = useTasksQuery(campId);
    const { data: assignments = [], isLoading: isLoadingAssignments, refetch: refetchAssignments } = useTaskAssignmentsQuery(
        selectedTaskId ?? 0,
        selectedTaskId != null,
    );

    const { assign, unassign } = useTaskAssignmentMutation();

    const assignedPersonIds = useMemo(
        () => new Set(assignments.map((a) => a.person_id)),
        [assignments],
    );

    function handleToggleWorker(id: number) {
        setSelectedWorkerIds((prev) =>
            prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id],
        );
    }

    function handleToggleAll() {
        const activeWorkers = workers.filter(
            (w) => !assignedPersonIds.has(w.id!),
        );
        const allSelected = activeWorkers.every((w) => selectedWorkerIds.includes(w.id!));
        setSelectedWorkerIds(allSelected ? [] : activeWorkers.map((w) => w.id!));
    }

    function handleSelectTask(taskId: number | null) {
        setSelectedTaskId(taskId);
        setSelectedWorkerIds([]);
    }

    async function handleAssign() {
        if (!selectedTaskId || selectedWorkerIds.length === 0) return;

        const toAssign = selectedWorkerIds.filter((id) => !assignedPersonIds.has(id));
        if (toAssign.length === 0) {
            toast({ tone: "warning", message: "All selected workers are already assigned to this task." });
            return;
        }

        let successCount = 0;
        let errorCount = 0;
        const errorMessages: string[] = [];

        for (const personId of toAssign) {
            const result = await assign.mutateAsync({
                task_id: selectedTaskId,
                person_id: personId,
                state: "A",
            });
            if (result.getEstado()) {
                successCount++;
            } else {
                errorCount++;
                const message = result.getMensaje();
                if (message) errorMessages.push(message);
            }
        }

        if (successCount > 0) {
            toast({ tone: "success", message: `${successCount} worker(s) assigned successfully.` });
            setSelectedWorkerIds([]);
            refetchAssignments();
        }
        if (errorCount > 0) {
            const uniqueMessages = Array.from(new Set(errorMessages));
            toast({
                tone: "error",
                message: uniqueMessages.length > 0
                    ? uniqueMessages.join(" ")
                    : `${errorCount} assignment(s) failed.`,
            });
        }
    }

    async function handleUnassign(taskId: number, personId: number) {
        const result = await unassign.mutateAsync({ taskId, personId });
        if (result.getEstado()) {
            toast({ tone: "success", message: "Worker unassigned successfully." });
            refetchAssignments();
        } else {
            toast({ tone: "error", message: result.getMensaje() ?? "Failed to unassign worker." });
        }
    }

    function handleRefresh() {
        refetchWorkers();
        refetchTasks();
        if (selectedTaskId) refetchAssignments();
    }

    function handleTaskCreated(taskId: number) {
        refetchTasks();
        if (taskId > 0) {
            setSelectedTaskId(taskId);
            setSelectedWorkerIds([]);
        }
        toast({ tone: "success", message: "Task created successfully." });
    }

    const canAssign = selectedTaskId != null && selectedWorkerIds.length > 0 && !assign.isPending;

    return (
        <article className="app-scope app-module">
            <header className="app-module-header">
                <div className="app-module-brand">
                    <div className="app-module-copy">
                        <div className="app-module-title">Task Management</div>
                        <p className="app-module-subtitle">Assign workers to camp tasks</p>
                    </div>
                </div>

                <nav className="app-module-tabs">
                    <button className="app-module-tab app-module-tab--active">
                        <div className="app-module-tab-indicator" />
                        <span className="app-module-tab-icon"><ClipboardCheck size={16} /></span>
                        <div className="app-module-tab-copy">
                            <div className="app-module-tab-label">Assignments</div>
                        </div>
                    </button>
                </nav>

                <div className="app-module-actions">
                    <button
                        onClick={handleRefresh}
                        className="app-btn app-btn--ghost app-btn--sm"
                        disabled={isLoadingWorkers || isLoadingTasks}
                        title="Refresh"
                    >
                        <RefreshCw size={12} className={isLoadingWorkers || isLoadingTasks ? "animate-spin" : ""} />
                        SYNC
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="app-btn app-btn--secondary app-btn--sm"
                        disabled={campId === 0}
                        title="Create new task"
                    >
                        <Plus size={12} />
                        NEW TASK
                    </button>
                    <button
                        onClick={handleAssign}
                        className="app-btn app-btn--primary app-btn--sm"
                        disabled={!canAssign}
                    >
                        <UserPlus size={12} />
                        ASSIGN ({selectedWorkerIds.length})
                    </button>
                </div>
            </header>

            <main className="app-module-body app-module-body--scroll">
                <div className="app-content-pad" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

                    {campId === 0 && (
                        <div className="app-alert app-alert--warn">
                            <AlertTriangle size={14} />
                            No camp assigned to your account.
                        </div>
                    )}

                    <section className="app-panel" style={{ padding: "1rem" }}>
                        <header className="app-panel-header" style={{ marginBottom: "0.75rem" }}>
                            <h2 className="app-panel-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <div style={{ width: "0.25rem", height: "0.75rem", background: "var(--color-accent)" }} />
                                Select Task
                            </h2>
                        </header>
                        <TaskSelector
                            tasks={tasks}
                            selectedTaskId={selectedTaskId}
                            onSelect={handleSelectTask}
                            isLoading={isLoadingTasks}
                        />
                    </section>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(22rem, 1fr))", gap: "0.75rem" }}>
                        <section className="app-panel app-table-frame">
                            <header className="app-panel-header">
                                <h2 className="app-panel-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <div style={{ width: "0.25rem", height: "0.75rem", background: "var(--color-accent)" }} />
                                    Workers
                                </h2>
                                <span className="app-muted" style={{ fontSize: "9px", letterSpacing: "0.1em" }}>
                                    [{selectedWorkerIds.length} selected]
                                </span>
                            </header>
                            <div className="app-table-wrap">
                                <WorkersListTable
                                    workers={workers}
                                    selectedIds={selectedWorkerIds}
                                    onToggle={handleToggleWorker}
                                    onToggleAll={handleToggleAll}
                                    isLoading={isLoadingWorkers}
                                    assignedPersonIds={assignedPersonIds}
                                />
                            </div>
                        </section>

                        <section className="app-panel app-table-frame">
                            <header className="app-panel-header">
                                <h2 className="app-panel-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <div style={{ width: "0.25rem", height: "0.75rem", background: "var(--color-txt-primary)" }} />
                                    Current Assignments
                                </h2>
                                {selectedTaskId == null && (
                                    <span className="app-muted" style={{ fontSize: "9px", letterSpacing: "0.1em" }}>
                                        [SELECT A TASK]
                                    </span>
                                )}
                            </header>
                            <div className="app-table-wrap">
                                {selectedTaskId == null ? (
                                    <div className="app-empty-state">
                                        <span className="app-muted">Select a task to view its assignments.</span>
                                    </div>
                                ) : (
                                    <CurrentAssignmentsTable
                                        assignments={assignments}
                                        workers={workers}
                                        isLoading={isLoadingAssignments}
                                        onUnassign={handleUnassign}
                                        isUnassigning={unassign.isPending}
                                    />
                                )}
                            </div>
                        </section>
                    </div>

                </div>
            </main>

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                campId={campId}
                onClose={() => setIsCreateModalOpen(false)}
                onCreated={handleTaskCreated}
            />
        </article>
    );
}
