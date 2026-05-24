import { zodResolver } from "@hookform/resolvers/zod";
import { Save, AlertTriangle } from "lucide-react";
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

    return (
        <div className="bg-bg-secondary border border-border-default">
            <div className="px-5 py-4 border-b border-border-default bg-status-warning/10">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-status-warning uppercase tracking-[0.15em]">
                    <AlertTriangle className="w-4 h-4" />
                    Ajuste Manual de Producción
                </div>
                <div className="text-[10px] font-mono text-txt-secondary mt-1">
                    Usar solo cuando un trabajador no pudo cumplir el objetivo por razones justificadas
                </div>
            </div>

            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="p-5 space-y-4"
            >
                <Field label="Trabajador" required error={errors.person_id?.message}>
                    <select {...form.register("person_id", { valueAsNumber: true })} className={fieldClass}>
                        <option value={0}>[ SELECCIONAR TRABAJADOR ]</option>
                        {personOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Bodega" required error={errors.warehouse_id?.message}>
                    <select {...form.register("warehouse_id", { valueAsNumber: true })} className={fieldClass}>
                        <option value={0}>[ SELECCIONAR BODEGA ]</option>
                        {warehouseOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Recurso" required error={errors.resource_id?.message}>
                    <select {...form.register("resource_id", { valueAsNumber: true })} className={fieldClass}>
                        <option value={0}>[ SELECCIONAR RECURSO ]</option>
                        {resourceOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Cantidad Real Producida" required error={errors.amount?.message}>
                    <input
                        type="number"
                        {...form.register("amount", { valueAsNumber: true })}
                        placeholder="0"
                        min={1}
                        className={fieldClass}
                    />
                </Field>

                <Field label="Fecha de Producción" required error={errors.production_date?.message}>
                    <input
                        type="date"
                        {...form.register("production_date")}
                        className={fieldClass}
                    />
                </Field>

                <Field label="Motivo del Ajuste" error={errors.notes?.message}>
                    <textarea
                        {...form.register("notes")}
                        placeholder="Ej: Trabajador enfermo, cantidad menor por falta de materiales, etc."
                        rows={3}
                        className={fieldClass}
                    />
                </Field>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-status-warning border border-status-warning px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-bg-primary hover:bg-status-warning/90 transition-all disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? "Registrando..." : "Registrar Ajuste"}
                </button>
            </form>
        </div>
    );
}
