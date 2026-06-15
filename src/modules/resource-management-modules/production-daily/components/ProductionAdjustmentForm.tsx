import { zodResolver } from "@hookform/resolvers/zod";
import { Save, RotateCcw } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { PersonSearchPicker } from "../../shared/components/PersonSearchPicker";
import { ResourceSearchPicker } from "../../shared/components/ResourceSearchPicker";
import { WarehouseSearchPicker } from "../../shared/components/WarehouseSearchPicker";
import { productionRecordSchema, type ProductionRecordFormValues, EMPTY_PRODUCTION_RECORD } from "../schemas/production-record.schema";

type Props = {
    personOptions: { id: number; label: string }[];
    warehouseOptions: { id: number; label: string }[];
    resourceOptions: { id: number; label: string }[];
    isSubmitting?: boolean;
    onSubmit: (values: ProductionRecordFormValues) => Promise<void>;
};

const fieldClass =
    "app-input w-full";

function Field({
    label,
    required,
    id,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    id?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <label className="app-label">
                <span className="flex items-center gap-1.5">
                    {required && <span className="text-accent">*</span>}
                    {label}
                </span>
                {id && <span className="app-field-id">#{id}</span>}
            </label>
            {children}
        </div>
    );
}

export function ProductionAdjustmentForm({
    personOptions,
    warehouseOptions,
    resourceOptions,
    isSubmitting = false,
    onSubmit,
}: Props) {
    const form = useForm<ProductionRecordFormValues>({
        resolver: zodResolver(productionRecordSchema),
        defaultValues: EMPTY_PRODUCTION_RECORD,
    });
    const errors = form.formState.errors;
    const selectedPersonId = useWatch({ control: form.control, name: "person_id" }) ?? 0;
    const selectedWarehouseId = useWatch({ control: form.control, name: "warehouse_id" }) ?? 0;
    const selectedResourceId = useWatch({ control: form.control, name: "resource_id" }) ?? 0;

    const handleSubmit = async (values: ProductionRecordFormValues) => {
        await onSubmit(values);
        form.reset(EMPTY_PRODUCTION_RECORD);
    };

    const handleClear = () => {
        form.reset(EMPTY_PRODUCTION_RECORD);
    };

    return (

        <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-1 min-h-0 flex-col relative"
        >

            <header className="px-6 py-4 border-b border-border-default bg-bg-secondary/20 backdrop-blur-lg shrink-0">
                <span className="app-section-title font-abril">Adjustment Record</span>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <Field label="Worker:" required id="" error={errors.person_id?.message}>
                    <input type="hidden" {...form.register("person_id", { valueAsNumber: true })} />
                    <PersonSearchPicker
                        selectedId={selectedPersonId}
                        onChange={(id) => form.setValue("person_id", id, { shouldDirty: true, shouldValidate: true })}
                        options={personOptions}
                    />
                </Field>

                <Field label="Warehouse:" required id="" error={errors.warehouse_id?.message}>
                    <input type="hidden" {...form.register("warehouse_id", { valueAsNumber: true })} />
                    <WarehouseSearchPicker
                        selectedId={selectedWarehouseId}
                        onChange={(id) => form.setValue("warehouse_id", id, { shouldDirty: true, shouldValidate: true })}
                        options={warehouseOptions}
                    />
                </Field>

                <Field label="Resource:" required id="" error={errors.resource_id?.message}>
                    <input type="hidden" {...form.register("resource_id", { valueAsNumber: true })} />
                    <ResourceSearchPicker
                        selectedId={selectedResourceId}
                        onChange={(id) => form.setValue("resource_id", id, { shouldDirty: true, shouldValidate: true })}
                        options={resourceOptions}
                    />
                </Field>

                <Field label="Actual Produced Quantity:" required id="" error={errors.amount?.message}>
                    <input
                        type="number"
                        {...form.register("amount", { valueAsNumber: true })}
                        placeholder="0"
                        min={1}
                        className={fieldClass}
                    />
                </Field>

                <Field label="Production Date:" required id="" error={errors.production_date?.message}>
                    <input
                        type="date"
                        {...form.register("production_date")}
                        className={fieldClass}
                    />
                </Field>

                <Field label="Adjustment Reason:" id="" error={errors.notes?.message}>
                    <textarea
                        {...form.register("notes")}
                        placeholder="E.g.: Worker sick, lower quantity due to lack of materials, etc."
                        rows={3}
                        className={fieldClass}
                    />
                </Field>
            </div>


            <footer className="px-6 py-6 border-t border-border-default bg-bg-secondary/10 flex gap-2 shrink-0">
                <button
                    type="button"
                    onClick={handleClear}
                    disabled={isSubmitting}
                    className="app-btn app-btn--secondary"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="font-mono">CLEAR</span>
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="app-btn app-btn--primary app-btn--full"
                >
                    <Save className="h-3.5 w-3.5" />
                    <span className="font-mono">{isSubmitting ? "..." : "SAVE"}</span>
                </button>
            </footer>
        </form>
    );
}
