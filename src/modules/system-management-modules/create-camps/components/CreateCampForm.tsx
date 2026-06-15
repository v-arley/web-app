import { Save, Trash2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { User } from "../../../../models/User";
import SystemConfirmModal from "../../shared/components/SystemConfirmModal";
import { MapLocationPicker } from "../../shared/components/MapLocationPicker";
import { UserSearchPicker } from "../../shared/components/UserSearchPicker";
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

const REQUIRED_FIELDS: Array<keyof CampFormValues> = ["code", "description", "capacity"];

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
    const hasLocation = values.location_x !== 0 || values.location_y !== 0;
    const changeSummary = useMemo(
        () => [
            `Code: ${values.code || "Pending"}`,
            `Description: ${values.description || "Pending"}`,
            `Capacity: ${values.capacity}`,
            `Location: ${hasLocation ? `${values.location_y}, ${values.location_x}` : "Not set"}`,
            `Admin: ${adminLabel}`,
            `State: ${values.state}`,
            `Initial warehouse: ${isCreateMode ? values.warehouse_name || "None" : "Only available on create"}`,
        ],
        [adminLabel, hasLocation, isCreateMode, values],
    );

    const persist = async () => {
        if (selectedId == null) {
            await onSave(values, null);
            return;
        }

        const locationSet = values.location_x !== 0 || values.location_y !== 0;
        await onUpdate(selectedId, {
            code: values.code,
            description: values.description,
            capacity: Number(values.capacity),
            location_x: locationSet ? Number(values.location_x) : undefined,
            location_y: locationSet ? Number(values.location_y) : undefined,
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
                    <h2 className="app-section-title font-abril">Camp Detail</h2>
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
                        <span className="app-label"><span className="flex items-center gap-1.5"><span className="text-accent">*</span>Capacity:</span></span>
                        <input className="app-input w-full" type="number" min={0} value={values.capacity} onChange={(event) => setValues({ ...values, capacity: Number(event.target.value) })} />
                    </label>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                        <span className="app-label">Location (Lat, Lng):</span>
                        <MapLocationPicker
                            location_x={values.location_x}
                            location_y={values.location_y}
                            onChange={(coords) => setValues({ ...values, ...coords })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="app-label">Admin:</span>
                        <UserSearchPicker
                            selectedId={values.admin_id}
                            users={adminOptions}
                            onChange={(id) => setValues({ ...values, admin_id: id })}
                            allowClear
                        />
                    </div>
                    <label className="flex flex-col gap-2">
                        <span className="app-label">State:</span>
                        <select className="app-input w-full" value={values.state ?? "A"} onChange={(event) => setValues({ ...values, state: event.target.value })}>
                            <option value="A">Active</option>
                            <option value="I">Inactive</option>
                        </select>
                    </label>
                </div>

                <label className="flex flex-col gap-2">
                    <span className="app-label"><span className="flex items-center gap-1.5"><span className="text-accent">*</span>Description:</span></span>
                    <textarea className="app-input w-full min-h-20 resize-none" value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} />
                </label>

                {isCreateMode ? (
                    <section className="border border-border-default bg-bg-secondary/10 p-4 space-y-4">
                        <div>
                            <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide">Initial Warehouse</div>
                            <div className="font-mono text-[11px] text-txt-muted uppercase tracking-widest mt-0.5">Optional warehouse created after the camp is saved.</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="flex flex-col gap-2">
                                <span className="app-label">Warehouse Name:</span>
                                <input className="app-input w-full" value={values.warehouse_name ?? ""} onChange={(event) => setValues({ ...values, warehouse_name: event.target.value })} />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="app-label">Warehouse Location:</span>
                                <input
                                    className="app-input w-full"
                                    value={values.warehouse_location_details ?? ""}
                                    onChange={(event) => setValues({ ...values, warehouse_location_details: event.target.value })}
                                />
                            </label>
                        </div>
                    </section>
                ) : null}
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
