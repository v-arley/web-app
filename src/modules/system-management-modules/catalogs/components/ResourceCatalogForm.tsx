import { Save, Trash2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SystemConfirmModal from "../../shared/components/SystemConfirmModal";
import type { ResourceCatalogFormValues, ResourceCatalogRecord } from "../schemas/resource.schema";
import { EMPTY_RESOURCE_FORM } from "../schemas/resource.schema";

type PendingAction = "save" | "delete" | null;

type ResourceCatalogFormProps = {
    selectedRecord: ResourceCatalogRecord | null;
    isSaving: boolean;
    onSave: (values: ResourceCatalogFormValues, id: number | null) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onClear: () => void;
};

const REQUIRED_FIELDS: Array<keyof ResourceCatalogFormValues> = ["code", "name", "category", "unitOfMeasure"];

function hasRequiredFields(values: ResourceCatalogFormValues) {
    return REQUIRED_FIELDS.every((field) => String(values[field] ?? "").trim().length > 0);
}

export function ResourceCatalogForm({ selectedRecord, isSaving, onSave, onDelete, onClear }: ResourceCatalogFormProps) {
    const [values, setValues] = useState<ResourceCatalogFormValues>(EMPTY_RESOURCE_FORM);
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);

    useEffect(() => {
        if (!selectedRecord) {
            setValues(EMPTY_RESOURCE_FORM);
            return;
        }

        setValues({
            code: selectedRecord.code,
            name: selectedRecord.name,
            description: selectedRecord.description,
            category: selectedRecord.category,
            unitOfMeasure: selectedRecord.unitOfMeasure,
            consumable: selectedRecord.consumable,
            state: selectedRecord.state,
        });
    }, [selectedRecord]);

    const selectedId = selectedRecord?.id ?? null;
    const canSave = hasRequiredFields(values) && !isSaving;
    const changeSummary = useMemo(
        () => [
            `Code: ${values.code || "Pending"}`,
            `Name: ${values.name || "Pending"}`,
            `Category: ${values.category || "Pending"}`,
            `State: ${values.state}`,
        ],
        [values],
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
                    <h2 className="app-section-title font-abril">Resource Detail</h2>
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
                        <span className="app-label"><span className="flex items-center gap-1.5"><span className="text-accent">*</span>Category:</span></span>
                        <input className="app-input w-full" value={values.category} onChange={(event) => setValues({ ...values, category: event.target.value })} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="app-label"><span className="flex items-center gap-1.5"><span className="text-accent">*</span>Unit:</span></span>
                        <input className="app-input w-full" value={values.unitOfMeasure} onChange={(event) => setValues({ ...values, unitOfMeasure: event.target.value })} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="app-label">State:</span>
                        <select className="app-input w-full" value={values.state} onChange={(event) => setValues({ ...values, state: event.target.value as "A" | "I" })}>
                            <option value="A">Active</option>
                            <option value="I">Inactive</option>
                        </select>
                    </label>
                    <label className="flex items-center gap-3 border border-border-default bg-bg-secondary/20 p-3">
                        <input
                            type="checkbox"
                            checked={Boolean(values.consumable)}
                            onChange={(event) => setValues({ ...values, consumable: event.target.checked })}
                        />
                        <span className="app-label">Consumable Resource</span>
                    </label>
                </div>

                <label className="flex flex-col gap-2">
                    <span className="app-label">Description:</span>
                    <textarea className="app-input w-full min-h-28 resize-none" value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} />
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
                title="Confirm resource save"
                description="Review the resource values before applying changes."
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
                title="Delete resource"
                description="This action removes the selected resource catalog record."
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

export default ResourceCatalogForm;
