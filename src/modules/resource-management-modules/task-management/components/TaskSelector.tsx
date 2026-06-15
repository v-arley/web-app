import { useState } from "react";
import { ClipboardList } from "lucide-react";
import type { Task, TaskPriority, TaskDifficulty } from "../../../../models/Task";
import {
    SearchPickerButton,
    SearchPickerModal,
} from "../../shared/components/SearchPickerModal";

interface TaskSelectorProps {
    tasks: Task[];
    selectedTaskId: number | null;
    onSelect: (taskId: number | null) => void;
    isLoading: boolean;
}

const PRIORITY_LABELS: Record<TaskPriority, string> = {
    L: "Low",
    M: "Medium",
    H: "High",
};

const DIFFICULTY_LABELS: Record<TaskDifficulty, string> = {
    L: "Easy",
    M: "Medium",
    H: "Hard",
};

const PRIORITY_BADGE: Record<TaskPriority, string> = {
    L: "app-badge--ok",
    M: "app-badge--warn",
    H: "app-badge--crit",
};

type TaskPickerItem = {
    id: number;
    label: string;
    type: string;
    priority: string;
    priorityLabel: string;
    [key: string]: unknown;
};

export function TaskSelector({ tasks, selectedTaskId, onSelect, isLoading }: TaskSelectorProps) {
    const [open, setOpen] = useState(false);

    const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

    const items: TaskPickerItem[] = tasks.map((t) => ({
        id: t.id,
        label: t.name || t.title,
        type: t.type ?? "",
        priority: t.priority ?? "",
        priorityLabel: t.priority ? (PRIORITY_LABELS[t.priority as TaskPriority] ?? t.priority) : "—",
    }));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
                <label className="app-label">Select Task</label>
                <SearchPickerButton
                    label={selectedTask ? (selectedTask.name || selectedTask.title) : ""}
                    placeholder="[ SEARCH TASK ]"
                    onOpen={() => setOpen(true)}
                    onClear={selectedTaskId != null ? () => onSelect(null) : undefined}
                    disabled={isLoading}
                />
            </div>

            <SearchPickerModal
                isOpen={open}
                title="Search Task"
                icon={<ClipboardList size={16} />}
                items={items}
                columns={[
                    {
                        key: "label",
                        header: "Task",
                        render: (item) => (
                            <span className="truncate font-mono text-[11px]">{item.label}</span>
                        ),
                    },
                    {
                        key: "type",
                        header: "Type",
                        render: (item) => (
                            <span className="text-txt-secondary font-mono text-[10px]">{item.type || "—"}</span>
                        ),
                    },
                    {
                        key: "priority",
                        header: "Priority",
                        className: "text-right",
                        render: (item) => (
                            item.priority ? (
                                <span className={`app-badge ${PRIORITY_BADGE[item.priority as TaskPriority] ?? "app-badge--warn"}`}>
                                    {item.priorityLabel}
                                </span>
                            ) : <span className="text-txt-disabled">—</span>
                        ),
                    },
                ]}
                searchFields={["label", "type"]}
                onSelect={(item) => { onSelect(item.id as number); }}
                onClose={() => setOpen(false)}
                isLoading={isLoading}
                pageSize={10}
                emptyMessage="No tasks found"
            />

            {selectedTask && (
                <div className="app-panel" style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                            {selectedTask.name || selectedTask.title}
                        </span>
                        {selectedTask.priority && (
                            <span className={`app-badge ${PRIORITY_BADGE[selectedTask.priority as TaskPriority] ?? "app-badge--warn"}`}>
                                {PRIORITY_LABELS[selectedTask.priority as TaskPriority] ?? selectedTask.priority}
                            </span>
                        )}
                    </div>

                    {selectedTask.description && (
                        <p className="app-muted" style={{ fontSize: "0.72rem", margin: 0 }}>
                            {selectedTask.description}
                        </p>
                    )}

                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        {selectedTask.type && (
                            <span className="app-muted" style={{ fontSize: "0.7rem" }}>
                                TYPE: <strong>{selectedTask.type}</strong>
                            </span>
                        )}
                        {selectedTask.difficulty && (
                            <span className="app-muted" style={{ fontSize: "0.7rem" }}>
                                DIFFICULTY: <strong>{DIFFICULTY_LABELS[selectedTask.difficulty as TaskDifficulty] ?? selectedTask.difficulty}</strong>
                            </span>
                        )}
                        {selectedTask.estimated_minutes && (
                            <span className="app-muted" style={{ fontSize: "0.7rem" }}>
                                EST: <strong>{Math.round(selectedTask.estimated_minutes / 60)}h {selectedTask.estimated_minutes % 60}m</strong>
                            </span>
                        )}
                    </div>
                </div>
            )}

            {!isLoading && tasks.length === 0 && (
                <p className="app-muted" style={{ fontSize: "0.72rem", margin: 0 }}>
                    No tasks available for this camp.
                </p>
            )}
        </div>
    );
}
