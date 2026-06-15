import { Trash2 } from "lucide-react";
import type { TaskPerson } from "../../../../models/TaskPerson";
import type { TaskAssignmentState } from "../../../../models/Task";
import type { Person } from "../../../../models/Person";

interface CurrentAssignmentsTableProps {
    assignments: TaskPerson[];
    workers: Person[];
    isLoading: boolean;
    onUnassign: (taskId: number, personId: number) => void;
    isUnassigning: boolean;
}

const STATE_LABELS: Record<TaskAssignmentState, string> = {
    A: "Active",
    C: "Completed",
    assigned: "Active",
    in_progress: "In Progress",
    completed: "Completed",
};

const STATE_BADGE: Record<TaskAssignmentState, string> = {
    A: "app-badge--ok",
    C: "app-badge--muted",
    assigned: "app-badge--ok",
    in_progress: "app-badge--warn",
    completed: "app-badge--muted",
};

function formatDate(date?: Date | string | null): string {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function CurrentAssignmentsTable({
    assignments,
    workers,
    isLoading,
    onUnassign,
    isUnassigning,
}: CurrentAssignmentsTableProps) {
    const workerMap = new Map(workers.map((w) => [w.id, w]));

    if (isLoading) {
        return (
            <div className="app-loading-state">
                <span className="app-muted">Loading assignments...</span>
            </div>
        );
    }

    if (assignments.length === 0) {
        return (
            <div className="app-empty-state">
                <span className="app-muted">No workers assigned to this task yet.</span>
            </div>
        );
    }

    return (
        <table className="app-table">
            <thead>
                <tr>
                    <th>Worker</th>
                    <th>DNI</th>
                    <th>State</th>
                    <th>Assigned At</th>
                    <th style={{ width: "3rem" }}></th>
                </tr>
            </thead>
            <tbody>
                {assignments.map((assignment) => {
                    const worker = workerMap.get(assignment.person_id);
                    const stateKey = (assignment.state as TaskAssignmentState) ?? "A";
                    return (
                        <tr key={`${assignment.task_id}-${assignment.person_id}`}>
                            <td>{worker ? `${worker.name} ${worker.last_name}` : `Person #${assignment.person_id}`}</td>
                            <td className="app-muted">{worker?.dni ?? "—"}</td>
                            <td>
                                <span className={`app-badge ${STATE_BADGE[stateKey] ?? "app-badge--warn"}`}>
                                    {STATE_LABELS[stateKey] ?? stateKey}
                                </span>
                            </td>
                            <td className="app-muted" style={{ fontSize: "0.7rem" }}>
                                {formatDate(assignment.assigned_at)}
                            </td>
                            <td>
                                <button
                                    className="app-btn app-btn--ghost app-btn--sm"
                                    onClick={() => onUnassign(assignment.task_id, assignment.person_id)}
                                    disabled={isUnassigning}
                                    title="Unassign worker"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
