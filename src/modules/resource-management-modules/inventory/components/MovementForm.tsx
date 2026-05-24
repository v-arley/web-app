import { zodResolver } from "@hookform/resolvers/zod";
import { PackagePlus, RotateCcw, Save } from "lucide-react";
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
        defaultValues: { ...EMPTY_RESOURCE_MOVEMENT, ...initialData },
    });
    const errors = form.formState.errors;
    const movementType = form.watch("movement_type");

    useEffect(() => {
        form.reset({ ...EMPTY_RESOURCE_MOVEMENT, ...initialData });
    }, [form, initialData]);

    const handleClear = () => {
        form.reset(EMPTY_RESOURCE_MOVEMENT);
        onClear();
    };

    return (
        <form
            onSubmit={form.handleSubmit(async (values) => onSubmit(values))}
            className="flex h-full flex-col"
        >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-default bg-bg-secondary/50">
                <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em]">
                    Registrar Movimiento
                </div>
                <PackagePlus className="h-4 w-4 text-accent" />
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <Field label="Almacén" required error={errors.warehouse_id?.message}>
                    <select {...form.register("warehouse_id", { valueAsNumber: true })} className={fieldClass}>
                        <option value={0}>[ SELECCIONAR ALMACÉN ]</option>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Tipo de Movimiento" required error={errors.movement_type?.message}>
                        <select {...form.register("movement_type")} className={fieldClass}>
                            <option value="E">ENTRADA</option>
                            <option value="S">SALIDA</option>
                            <option value="A">AJUSTE</option>
                        </select>
                    </Field>

                    {movementType === "A" && (
                        <Field label="Signo de Ajuste" required error={errors.adjustment_sign?.message}>
                            <select {...form.register("adjustment_sign")} className={fieldClass}>
                                <option value="">[ SELECCIONAR ]</option>
                                <option value="+">+ (INCREMENTAR)</option>
                                <option value="-">- (DECREMENTAR)</option>
                            </select>
                        </Field>
                    )}
                </div>

                <Field label="Cantidad" required error={errors.amount?.message}>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...form.register("amount", { valueAsNumber: true })}
                        className={fieldClass}
                        placeholder="0.00"
                    />
                </Field>

                <Field label="Razón / Observaciones" error={errors.reason?.message}>
                    <textarea
                        {...form.register("reason")}
                        rows={4}
                        className={`${fieldClass} resize-none`}
                        placeholder="Descripción del movimiento (opcional)"
                    />
                </Field>
            </div>

            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border-default bg-bg-secondary/30">
                <button
                    type="button"
                    onClick={handleClear}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2.5 bg-bg-tertiary border border-border-default font-mono text-[10px] font-bold text-txt-secondary uppercase tracking-widest hover:border-txt-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Limpiar
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2.5 bg-accent border border-accent font-mono text-[10px] font-bold text-white uppercase tracking-widest hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="h-3.5 w-3.5" />
                    {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
            </div>
        </form>
    );
}
