import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { EMPTY_RESOURCE_MOVEMENT, resourceMovementSchema, type ResourceMovementFormValues } from "../schemas/resource-movement.schema";

type Props = {
    warehouseOptions: { id: number; label: string }[];
    resourceOptions: { id: number; label: string }[];
    initialData?: Partial<ResourceMovementFormValues>;
    isSubmitting?: boolean;
    onSubmit: (values: ResourceMovementFormValues) => Promise<void>;
    onClear: () => void;
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

export function MovementForm({
    warehouseOptions,
    resourceOptions,
    initialData,
    isSubmitting = false,
    onSubmit,
    onClear,
}: Props) {
    const form = useForm<ResourceMovementFormValues>({
        resolver: zodResolver(resourceMovementSchema),
        mode: 'onChange',
        defaultValues: { ...EMPTY_RESOURCE_MOVEMENT, ...initialData },
    });
    const errors = form.formState.errors;
    const movementType = form.watch("movement_type");
    const selectedWarehouseId = form.watch("warehouse_id");
    const selectedResourceId = form.watch("resource_id");
    const selectedWarehouseLabel =
        warehouseOptions.find((opt) => opt.id === selectedWarehouseId)?.label ?? "[ SELECT WAREHOUSE ]";
    const selectedResourceLabel =
        resourceOptions.find((opt) => opt.id === selectedResourceId)?.label ?? "[ SELECT RESOURCE ]";

    useEffect(() => {
        form.reset({ ...EMPTY_RESOURCE_MOVEMENT, ...initialData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    const handleClear = () => {
        form.reset(EMPTY_RESOURCE_MOVEMENT);
        onClear();
    };

    return (
        <form
            onSubmit={form.handleSubmit(async (values) => onSubmit(values))}
            className="flex flex-1 min-h-0 flex-col relative"
        >
            

            <header className="px-4 py-3 sm:px-6 sm:py-4 border-b border-border-default bg-bg-secondary/20 backdrop-blur-lg shrink-0">
                <span className="app-section-title font-abril">Movement Record</span>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4 sm:p-6 space-y-4 sm:space-y-6">
                <Field label="Warehouse:" required id="" error={errors.warehouse_id?.message}>
                    <input type="hidden" {...form.register("warehouse_id", { valueAsNumber: true })} />
                    <input
                        type="text"
                        value={selectedWarehouseLabel}
                        disabled
                        className={`${fieldClass} cursor-not-allowed opacity-80`}
                    />
                </Field>

                <Field label="Resource name:" required id="" error={errors.resource_id?.message}>
                    <input type="hidden" {...form.register("resource_id", { valueAsNumber: true })} />
                    <input
                        type="text"
                        value={selectedResourceLabel}
                        disabled
                        className={`${fieldClass} cursor-not-allowed opacity-80`}
                    />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Operation:" required id="" error={errors.movement_type?.message}>
                        <select {...form.register("movement_type")} className={fieldClass}>
                            <option value="E">IN</option>
                            <option value="S">OUT</option>
                            <option value="A">ADJUST</option>
                        </select>
                    </Field>

                    {movementType === "A" && (
                        <Field label="Direction" required id="" error={errors.adjustment_sign?.message}>
                            <select {...form.register("adjustment_sign")} className={fieldClass}>
                                <option value="">[ SELECT ]</option>
                                <option value="+">INCREMENT (+)</option>
                                <option value="-">DECREMENT (-)</option>
                            </select>
                        </Field>
                    )}
                </div>

                <Field label="Quantity:" required id="" error={errors.amount?.message}>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...form.register("amount", { valueAsNumber: true })}
                        className={fieldClass}
                        placeholder="0.00"
                    />
                </Field>

                <Field label="Justification" id="" error={errors.reason?.message}>
                    <textarea
                        {...form.register("reason")}
                        rows={3}
                        className={`${fieldClass} resize-none`}
                        placeholder="Protocol details..."
                    />
                </Field>
            </div>

            <footer className="px-4 py-4 sm:px-6 sm:py-6 border-t border-border-default bg-bg-secondary/10 grid grid-cols-2 gap-2 shrink-0">
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

