import { zodResolver } from "@hookform/resolvers/zod";
import { Save, RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { productionRecordSchema, type ProductionRecordFormValues, EMPTY_PRODUCTION_RECORD } from "../schemas/production-record.schema";

type Props = {
    personOptions: { id: number; label: string }[];
    warehouseOptions: { id: number; label: string }[];
    resourceOptions: { id: number; label: string }[];
    isSubmitting?: boolean;
    onSubmit: (values: ProductionRecordFormValues) => Promise<void>;
};

const fieldClass =
    "bg-bg-tertiary border border-border-default px-3 py-2.5 font-mono text-xs text-txt-primary focus:border-accent outline-none transition-all placeholder:text-txt-disabled/30 w-full";

function Field({
    label,
    required,
    error,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="flex items-center justify-between gap-3 text-[10px] font-mono font-bold uppercase tracking-widest">
                <span className={required ? "text-status-critical" : "text-txt-disabled"}>{label}</span>
                {error ? <span className="text-status-critical normal-case tracking-normal">{error}</span> : null}
            </span>
            {children}
        </label>
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

            <header className="px-6 py-4 border-b border-border-default bg-bg-secondary/20 backdrop-blur-lg">
                <span className="rmm-section-title font-abril">Adjustment Record</span>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <Field label="Worker" required error={errors.person_id?.message}>
                    <select {...form.register("person_id", { valueAsNumber: true })} className={fieldClass}>
                        <option value={0}>[ SELECT WORKER ]</option>
                        {personOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Warehouse" required error={errors.warehouse_id?.message}>
                    <select {...form.register("warehouse_id", { valueAsNumber: true })} className={fieldClass}>
                        <option value={0}>[ SELECT WAREHOUSE ]</option>
                        {warehouseOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Resource" required error={errors.resource_id?.message}>
                    <select {...form.register("resource_id", { valueAsNumber: true })} className={fieldClass}>
                        <option value={0}>[ SELECT RESOURCE ]</option>
                        {resourceOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Actual Produced Quantity" required error={errors.amount?.message}>
                    <input
                        type="number"
                        {...form.register("amount", { valueAsNumber: true })}
                        placeholder="0"
                        min={1}
                        className={fieldClass}
                    />
                </Field>

                <Field label="Production Date" required error={errors.production_date?.message}>
                    <input
                        type="date"
                        {...form.register("production_date")}
                        className={fieldClass}
                    />
                </Field>

                <Field label="Adjustment Reason" error={errors.notes?.message}>
                    <textarea
                        {...form.register("notes")}
                        placeholder="E.g.: Worker sick, lower quantity due to lack of materials, etc."
                        rows={3}
                        className={fieldClass}
                    />
                </Field>
            </div>


            <footer className="px-6 py-6 border-t border-border-default bg-bg-secondary/10 flex gap-2">
                <button
                    type="button"
                    onClick={handleClear}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-bg-tertiary border border-border-default px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-txt-secondary hover:bg-bg-secondary hover:text-txt-primary transition-all disabled:opacity-50"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    CLEAR
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-status-warning border border-status-warning px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-bg-primary hover:bg-status-warning/90 transition-all disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? "..." : "SAVE"}
                </button>
            </footer>
        </form>
    );
}
