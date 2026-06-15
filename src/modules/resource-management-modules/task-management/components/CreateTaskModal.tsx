import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus } from "lucide-react";
import { useCreateTaskMutation } from "../hooks/useCreateTaskMutation";
import type { TaskPriority, TaskDifficulty } from "../../../../models/Task";

interface CreateTaskModalProps {
    isOpen: boolean;
    campId: number;
    onClose: () => void;
    onCreated: (taskId: number) => void;
}

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
    { value: "L", label: "Low" },
    { value: "M", label: "Medium" },
    { value: "H", label: "High" },
];

const DIFFICULTY_OPTIONS: { value: TaskDifficulty; label: string }[] = [
    { value: "L", label: "Easy" },
    { value: "M", label: "Medium" },
    { value: "H", label: "Hard" },
];

const INITIAL_FORM = {
    name: "",
    description: "",
    type: "",
    priority: "" as TaskPriority | "",
    difficulty: "" as TaskDifficulty | "",
    estimated_hours: "",
};

export function CreateTaskModal({ isOpen, campId, onClose, onCreated }: CreateTaskModalProps) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const createTask = useCreateTaskMutation();

    if (!isOpen) return null;

    function handleChange(field: keyof typeof INITIAL_FORM, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    function validate() {
        const next: Record<string, string> = {};
        if (!form.name.trim()) next.name = "Name is required.";
        if (form.estimated_hours !== "" && Number.isNaN(Number(form.estimated_hours))) {
            next.estimated_hours = "Must be a valid number.";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        const result = await createTask.mutateAsync({
            camp_id: campId,
            name: form.name.trim(),
            description: form.description.trim() || undefined,
            type: form.type.trim() || undefined,
            priority: form.priority || undefined,
            difficulty: form.difficulty || undefined,
            estimated_hours: form.estimated_hours !== "" ? form.estimated_hours : undefined,
        });

        if (result.getEstado()) {
            const created = result.getResultado<{ id: number }>("registro");
            setForm(INITIAL_FORM);
            setErrors({});
            onCreated(created?.id ?? 0);
            onClose();
        } else {
            setErrors({ submit: result.getMensaje() ?? "Failed to create task." });
        }
    }

    function handleClose() {
        setForm(INITIAL_FORM);
        setErrors({});
        onClose();
    }

    return createPortal(
        <div className="fixed inset-0 z-120 flex items-stretch justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-6">
            <button
                type="button"
                className="fixed inset-0 cursor-default"
                onClick={handleClose}
                aria-label="Close modal"
            />
            <section
                className="app-modal app-card--glass relative flex w-full max-w-lg flex-col overflow-hidden border border-border-default bg-bg-secondary shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-label="Create Task"
            >
                <header className="app-panel-header border-b border-border-default bg-bg-secondary/80">
                    <div className="flex items-center gap-2">
                        <Plus size={16} className="text-accent" />
                        <span className="app-panel-title">New Task</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="app-btn app-btn--ghost app-btn--icon app-btn--sm"
                        title="Close"
                    >
                        <X size={16} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto p-5">
                    <div>
                        <label className="app-label" htmlFor="ct-name">
                            Name <span className="text-crit">*</span>
                        </label>
                        <input
                            id="ct-name"
                            type="text"
                            className="app-input"
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Task name"
                            disabled={createTask.isPending}
                        />
                        {errors.name && <p className="app-field-error">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="app-label" htmlFor="ct-description">Description</label>
                        <textarea
                            id="ct-description"
                            className="app-input"
                            rows={3}
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Optional description"
                            disabled={createTask.isPending}
                            style={{ resize: "vertical" }}
                        />
                    </div>

                    <div>
                        <label className="app-label" htmlFor="ct-type">Type</label>
                        <input
                            id="ct-type"
                            type="text"
                            className="app-input"
                            value={form.type}
                            onChange={(e) => handleChange("type", e.target.value)}
                            placeholder="e.g. Maintenance, Logistics"
                            disabled={createTask.isPending}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                            <label className="app-label" htmlFor="ct-priority">Priority</label>
                            <select
                                id="ct-priority"
                                className="app-input"
                                value={form.priority}
                                onChange={(e) => handleChange("priority", e.target.value)}
                                disabled={createTask.isPending}
                            >
                                <option value="">— None —</option>
                                {PRIORITY_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="app-label" htmlFor="ct-difficulty">Difficulty</label>
                            <select
                                id="ct-difficulty"
                                className="app-input"
                                value={form.difficulty}
                                onChange={(e) => handleChange("difficulty", e.target.value)}
                                disabled={createTask.isPending}
                            >
                                <option value="">— None —</option>
                                {DIFFICULTY_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="app-label" htmlFor="ct-hours">Estimated Hours</label>
                        <input
                            id="ct-hours"
                            type="number"
                            min="0"
                            step="0.5"
                            className="app-input"
                            value={form.estimated_hours}
                            onChange={(e) => handleChange("estimated_hours", e.target.value)}
                            placeholder="e.g. 4"
                            disabled={createTask.isPending}
                        />
                        {errors.estimated_hours && <p className="app-field-error">{errors.estimated_hours}</p>}
                    </div>

                    {errors.submit && (
                        <p className="app-field-error">{errors.submit}</p>
                    )}

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", paddingTop: "0.25rem" }}>
                        <button
                            type="button"
                            className="app-btn app-btn--secondary app-btn--sm"
                            onClick={handleClose}
                            disabled={createTask.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="app-btn app-btn--primary app-btn--sm"
                            disabled={createTask.isPending}
                        >
                            <Plus size={12} />
                            {createTask.isPending ? "Creating..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </section>
        </div>,
        document.body,
    );
}
