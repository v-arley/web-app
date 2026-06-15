import { Save, Trash2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SystemConfirmModal from "../../shared/components/SystemConfirmModal";
import { EMPTY_ACHIEVEMENT_FORM, type AchievementCatalogFormValues, type AchievementCatalogRecord } from "../schemas/achievement.schema";

type PendingAction = "save" | "delete" | null;

type AchievementCatalogFormProps = {
    selectedRecord: AchievementCatalogRecord | null;
    isSaving: boolean;
    onSave: (values: AchievementCatalogFormValues, id: number | null) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onClear: () => void;
};

const REQUIRED_FIELDS: Array<keyof AchievementCatalogFormValues> = ["code", "name"];

function hasRequiredFields(values: AchievementCatalogFormValues) {
    return REQUIRED_FIELDS.every((field) => String(values[field] ?? "").trim().length > 0);
}

export function AchievementCatalogForm({ selectedRecord, isSaving, onSave, onDelete, onClear }: AchievementCatalogFormProps) {
    const [values, setValues] = useState<AchievementCatalogFormValues>(EMPTY_ACHIEVEMENT_FORM);
    const [conditionText, setConditionText] = useState("{}");
    const [conditionError, setConditionError] = useState<string | null>(null);
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);

    useEffect(() => {
        if (!selectedRecord) {
            setValues(EMPTY_ACHIEVEMENT_FORM);
            setConditionText("{}");
            setConditionError(null);
            return;
        }

        const condition = selectedRecord.conditionLogic ?? selectedRecord.condition_logic ?? null;

        setValues({
            code: selectedRecord.code,
            name: selectedRecord.name,
            description: selectedRecord.description ?? "",
            iconUrl: selectedRecord.iconUrl ?? selectedRecord.icon_url ?? "",
            conditionLogic: condition,
            points: selectedRecord.points ?? selectedRecord.requiredPoints ?? 0,
            category: selectedRecord.category ?? "",
            state: selectedRecord.state,
        });
        setConditionText(JSON.stringify(condition ?? {}, null, 2));
        setConditionError(null);
    }, [selectedRecord]);

    const selectedId = selectedRecord?.id ?? null;
    const canSave = hasRequiredFields(values) && !conditionError && !isSaving;
    const changeSummary = useMemo(
        () => [
            `Code: ${values.code || "Pending"}`,
            `Name: ${values.name || "Pending"}`,
            `Points: ${values.points ?? 0}`,
            `Category: ${values.category || "None"}`,
            `State: ${values.state ?? "A"}`,
        ],
        [values],
    );

    const updateCondition = (rawValue: string) => {
        setConditionText(rawValue);
        try {
            const parsed = rawValue.trim() ? JSON.parse(rawValue) : null;
            setValues({ ...values, conditionLogic: parsed });
            setConditionError(null);
        } catch {
            setConditionError("Condition logic must be valid JSON.");
        }
    };

    return (
        <form
            className="flex flex-1 min-h-0 flex-col relative"
            onSubmit={(event) => {
                event.preventDefault();
                if (canSave) setPendingAction("save");
            }}
        >
            <header className="px-6 py-4 border-b border-border-default bg-bg-secondary/20 backdrop-blur-lg">
                <div>
                    <h2 className="app-section-title font-abril">Achievement Detail</h2>
                    {/* <p className="app-field-id mt-1 inline-flex">ID: {selectedId ?? "AUTO-GENERATED"}</p> */}
                </div>
                {/* <div className="app-section-line mt-3" /> */}
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-2">
                        <span className="app-label"><span className="flex items-center gap-1.5"><span className="text-accent">*</span>Code:</span></span>
                        <input className="app-input w-full" value={values.code} onChange={(event) => setValues({ ...values, code: event.target.value })} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="app-label"><span className="flex items-center gap-1.5"><span className="text-accent">*</span>Name:</span></span>
                        <input className="app-input w-full" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="app-label">Category:</span>
                        <input className="app-input w-full" value={values.category ?? ""} onChange={(event) => setValues({ ...values, category: event.target.value })} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="app-label">Points:</span>
                        <input className="app-input w-full" type="number" min={0} value={values.points ?? 0} onChange={(event) => setValues({ ...values, points: Number(event.target.value) })} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="app-label">Icon URL:</span>
                        <input className="app-input w-full" value={values.iconUrl ?? ""} onChange={(event) => setValues({ ...values, iconUrl: event.target.value })} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="app-label">State:</span>
                        <select className="app-input w-full" value={values.state ?? "A"} onChange={(event) => setValues({ ...values, state: event.target.value as "A" | "I" })}>
                            <option value="A">Active</option>
                            <option value="I">Inactive</option>
                        </select>
                    </label>
                </div>

                <label className="flex flex-col gap-2">
                    <span className="app-label">Description:</span>
                    <textarea className="app-input w-full min-h-20 resize-none" value={values.description ?? ""} onChange={(event) => setValues({ ...values, description: event.target.value })} />
                </label>

                <label className="flex flex-col gap-2">
                    <span className="app-label">Condition Logic JSON:</span>
                    <textarea className="app-input w-full min-h-40 resize-none font-mono text-[10px]" value={conditionText} onChange={(event) => updateCondition(event.target.value)} />
                    {conditionError ? <span className="text-status-critical app-muted">{conditionError}</span> : null}
                </label>
            </div>

            <footer className="px-6 py-6 border-t border-border-default bg-bg-secondary/10 flex flex-wrap gap-2">
<button type="button" className="app-btn app-btn--outline" onClick={onClear}>
                    <XCircle size={14} />
                    Clear
                </button>
<button type="button" className="app-btn app-btn--outline" disabled={selectedId == null || isSaving} onClick={() => setPendingAction("delete")}>
                    <Trash2 size={14} />
                    Delete
                </button>
<button type="submit" className="app-btn app-btn--primary" disabled={!canSave}>
                    <Save size={14} />
                    Save
                </button>
            </footer>

            <SystemConfirmModal
                open={pendingAction === "save"}
                title="Confirm achievement save"
                description="Review the achievement values before applying changes."
                confirmLabel="Save"
                onCancel={() => setPendingAction(null)}
                onConfirm={() => {
                    setPendingAction(null);
                    void onSave(values, selectedId);
                }}
            >
                <ul className="space-y-2 text-[11px] text-txt-secondary uppercase tracking-wide">
                    {changeSummary.map((item) => <li key={item}>{item}</li>)}
                </ul>
            </SystemConfirmModal>

            <SystemConfirmModal
                open={pendingAction === "delete"}
                title="Delete achievement"
                description="This action removes the selected achievement catalog record."
                confirmLabel="Delete"
                tone="danger"
                onCancel={() => setPendingAction(null)}
                onConfirm={() => {
                    setPendingAction(null);
                    if (selectedId != null) void onDelete(selectedId);
                }}
            />
        </form>
    );
}

export default AchievementCatalogForm;
