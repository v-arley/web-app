import { Save, Trash2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Resource } from "../../../../models/Resource";
import SystemConfirmModal from "../../shared/components/SystemConfirmModal";
import { EMPTY_PROFESSION_FORM, type ProfessionCatalogFormValues, type ProfessionCatalogRecord } from "../schemas/profession.schema";

type PendingAction = "save" | "delete" | null;

type ProfessionCatalogFormProps = {
    selectedRecord: ProfessionCatalogRecord | null;
    resources: Resource[];
    isSaving: boolean;
    onSave: (values: ProfessionCatalogFormValues, id: number | null) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onClear: () => void;
};

const REQUIRED_FIELDS: Array<keyof ProfessionCatalogFormValues> = ["code", "name"];

function hasRequiredFields(values: ProfessionCatalogFormValues) {
    return REQUIRED_FIELDS.every((field) => String(values[field] ?? "").trim().length > 0);
}

export function ProfessionCatalogForm({ selectedRecord, resources, isSaving, onSave, onDelete, onClear }: ProfessionCatalogFormProps) {
    const [values, setValues] = useState<ProfessionCatalogFormValues>(EMPTY_PROFESSION_FORM);
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);

    useEffect(() => {
        if (!selectedRecord) {
            setValues(EMPTY_PROFESSION_FORM);
            return;
        }

        setValues({
            code: selectedRecord.code,
            name: selectedRecord.name,
            description: selectedRecord.description ?? "",
            default_resource_id: selectedRecord.default_resource_id ?? null,
            default_production_amount: selectedRecord.default_production_amount ?? null,
            state: selectedRecord.state,
        });
    }, [selectedRecord]);

    const selectedId = selectedRecord?.id ?? null;
    const canSave = hasRequiredFields(values) && !isSaving;
    const selectedResourceName = resources.find((resource) => resource.id === values.default_resource_id)?.name ?? "None";
    const changeSummary = useMemo(
        () => [
            `Code: ${values.code || "Pending"}`,
            `Name: ${values.name || "Pending"}`,
            `Default resource: ${selectedResourceName}`,
            `Production amount: ${values.default_production_amount ?? "None"}`,
            `State: ${values.state ?? "A"}`,
        ],
        [selectedResourceName, values],
    );

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
                    <h2 className="rmm-section-title font-abril">Profession Detail</h2>
                    <p className="rmm-field-id mt-1 inline-flex">ID: {selectedId ?? "AUTO-GENERATED"}</p>
                </div>
                <div className="sa-section-line mt-3" />
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-2">
                        <span className="rmm-label">Code *</span>
                        <input className="rmm-input w-full" value={values.code} onChange={(event) => setValues({ ...values, code: event.target.value })} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="rmm-label">Name *</span>
                        <input className="rmm-input w-full" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="rmm-label">Default Resource</span>
                        <select
                            className="rmm-input w-full"
                            value={values.default_resource_id ?? ""}
                            onChange={(event) => setValues({ ...values, default_resource_id: event.target.value ? Number(event.target.value) : null })}
                        >
                            <option value="">None</option>
                            {resources.map((resource) => (
                                <option key={resource.id} value={resource.id}>
                                    {resource.code} - {resource.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="rmm-label">Production Amount</span>
                        <input
                            className="rmm-input w-full"
                            type="number"
                            min={0}
                            value={values.default_production_amount ?? ""}
                            onChange={(event) => setValues({ ...values, default_production_amount: event.target.value ? Number(event.target.value) : null })}
                        />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="rmm-label">State</span>
                        <select className="rmm-input w-full" value={values.state ?? "A"} onChange={(event) => setValues({ ...values, state: event.target.value as "A" | "I" })}>
                            <option value="A">Active</option>
                            <option value="I">Inactive</option>
                        </select>
                    </label>
                </div>

                <label className="flex flex-col gap-2">
                    <span className="rmm-label">Description</span>
                    <textarea className="rmm-input w-full min-h-28 resize-none" value={values.description ?? ""} onChange={(event) => setValues({ ...values, description: event.target.value })} />
                </label>
            </div>

            <footer className="px-6 py-6 border-t border-border-default bg-bg-secondary/10 flex flex-wrap gap-2">
                <button type="button" className="rmm-btn rmm-btn-outline" onClick={onClear}>
                    <XCircle size={14} />
                    Clear
                </button>
                <button type="button" className="rmm-btn rmm-btn-outline" disabled={selectedId == null || isSaving} onClick={() => setPendingAction("delete")}>
                    <Trash2 size={14} />
                    Delete
                </button>
                <button type="submit" className="rmm-btn rmm-btn-accent" disabled={!canSave}>
                    <Save size={14} />
                    Save
                </button>
            </footer>

            <SystemConfirmModal
                open={pendingAction === "save"}
                title="Confirm profession save"
                description="Review the profession values before applying changes."
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
                title="Delete profession"
                description="This action removes the selected profession catalog record."
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

export default ProfessionCatalogForm;
