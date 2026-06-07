import { Save, Trash2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { User } from "../../../../models/User";
import SystemConfirmModal from "../../shared/components/SystemConfirmModal";
import { EMPTY_CAMP_FORM, type CampFormValues, type CampRecord, type CampUpdateValues } from "../schemas/camp.schema";

type PendingAction = "save" | "delete" | null;

type CreateCampFormProps = {
    selectedRecord: CampRecord | null;
    adminOptions: User[];
    isSaving: boolean;
    onSave: (values: CampFormValues, id: number | null) => Promise<void>;
    onUpdate: (id: number, values: CampUpdateValues) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onClear: () => void;
};

const REQUIRED_FIELDS: Array<keyof CampFormValues> = ["code", "description", "capacity", "location_x", "location_y"];

function hasRequiredFields(values: CampFormValues) {
    return REQUIRED_FIELDS.every((field) => String(values[field] ?? "").trim().length > 0);
}

export function CreateCampForm({ selectedRecord, adminOptions, isSaving, onSave, onUpdate, onDelete, onClear }: CreateCampFormProps) {
    const [values, setValues] = useState<CampFormValues>(EMPTY_CAMP_FORM);
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);

    useEffect(() => {
        if (!selectedRecord) {
            setValues(EMPTY_CAMP_FORM);
            return;
        }

        setValues({
            id: selectedRecord.id ?? null,
            code: selectedRecord.code,
            description: selectedRecord.description,
            capacity: selectedRecord.capacity,
            location_x: selectedRecord.location_x,
            location_y: selectedRecord.location_y,
            active: selectedRecord.active ?? selectedRecord.state !== "I",
            state: selectedRecord.state ?? "A",
            admin_id: selectedRecord.admin_id ?? selectedRecord.user_admin_id,
            warehouse_name: "",
            warehouse_location_details: "",
        });
    }, [selectedRecord]);

    const selectedId = selectedRecord?.id ?? null;
    const isCreateMode = selectedId == null;
    const canSave = hasRequiredFields(values) && !isSaving;
    const adminLabel = adminOptions.find((user) => user.id === values.admin_id)?.username ?? "None";
    const changeSummary = useMemo(
        () => [
            `Code: ${values.code || "Pending"}`,
            `Description: ${values.description || "Pending"}`,
            `Capacity: ${values.capacity}`,
            `Coordinates: ${values.location_x}, ${values.location_y}`,
            `Admin: ${adminLabel}`,
            `State: ${values.state}`,
            `Initial warehouse: ${isCreateMode ? values.warehouse_name || "None" : "Only available on create"}`,
        ],
        [adminLabel, isCreateMode, values],
    );

    const persist = async () => {
        if (selectedId == null) {
            await onSave(values, null);
            return;
        }

        await onUpdate(selectedId, {
            code: values.code,
            description: values.description,
            capacity: Number(values.capacity),
            location_x: Number(values.location_x),
            location_y: Number(values.location_y),
            active: values.active,
            state: values.state,
            admin_id: values.admin_id,
        });
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
                    <h2 className="rmm-section-title font-abril">Camp Detail</h2>
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
                        <span className="rmm-label">Capacity *</span>
                        <input className="rmm-input w-full" type="number" min={0} value={values.capacity} onChange={(event) => setValues({ ...values, capacity: Number(event.target.value) })} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="rmm-label">Location X *</span>
                        <input className="rmm-input w-full" type="number" step="any" value={values.location_x} onChange={(event) => setValues({ ...values, location_x: Number(event.target.value) })} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="rmm-label">Location Y *</span>
                        <input className="rmm-input w-full" type="number" step="any" value={values.location_y} onChange={(event) => setValues({ ...values, location_y: Number(event.target.value) })} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="rmm-label">Admin</span>
                        <select
                            className="rmm-input w-full"
                            value={values.admin_id ?? ""}
                            onChange={(event) => setValues({ ...values, admin_id: event.target.value ? Number(event.target.value) : undefined })}
                        >
                            <option value="">No admin assigned</option>
                            {adminOptions.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username ?? user.name ?? `User #${user.id}`}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="rmm-label">State</span>
                        <select className="rmm-input w-full" value={values.state ?? "A"} onChange={(event) => setValues({ ...values, state: event.target.value })}>
                            <option value="A">Active</option>
                            <option value="I">Inactive</option>
                        </select>
                    </label>
                </div>

                <label className="flex flex-col gap-2">
                    <span className="rmm-label">Description *</span>
                    <textarea className="rmm-input w-full min-h-20 resize-none" value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} />
                </label>

                {isCreateMode ? (
                    <section className="border border-border-default bg-bg-secondary/10 p-4 space-y-4">
                        <div>
                            <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide">Initial Warehouse</div>
                            <div className="font-mono text-[11px] text-txt-muted uppercase tracking-widest mt-0.5">Optional warehouse created after the camp is saved.</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="flex flex-col gap-2">
                                <span className="rmm-label">Warehouse Name</span>
                                <input className="rmm-input w-full" value={values.warehouse_name ?? ""} onChange={(event) => setValues({ ...values, warehouse_name: event.target.value })} />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="rmm-label">Warehouse Location</span>
                                <input
                                    className="rmm-input w-full"
                                    value={values.warehouse_location_details ?? ""}
                                    onChange={(event) => setValues({ ...values, warehouse_location_details: event.target.value })}
                                />
                            </label>
                        </div>
                    </section>
                ) : null}
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
                title="Confirm camp save"
                description="Review the camp values before applying changes."
                confirmLabel="Save"
                onCancel={() => setPendingAction(null)}
                onConfirm={() => {
                    setPendingAction(null);
                    void persist();
                }}
            >
                <ul className="space-y-2 text-[11px] text-txt-secondary uppercase tracking-wide">
                    {changeSummary.map((item) => <li key={item}>{item}</li>)}
                </ul>
            </SystemConfirmModal>

            <SystemConfirmModal
                open={pendingAction === "delete"}
                title="Delete camp"
                description="This action removes the selected camp record."
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

export default CreateCampForm;
