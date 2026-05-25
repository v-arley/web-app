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
    "rmm-input w-full";

function Field({
    label,
    required,
    error,
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
            <label className="rmm-label">
                <span className="flex items-center gap-1.5">
                    {required && <span className="text-accent">*</span>}
                    {label}
                </span>
                {id && <span className="rmm-field-id">#{id}</span>}
                {error && <span className="text-accent lowercase font-normal italic">!! {error}</span>}
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
            className="flex h-full flex-col relative"
        >
            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                <span className="font-mono text-[40px] font-bold">MOVE_STK</span>
            </div>

            <header className="px-6 py-4 border-b border-border-default bg-bg-secondary/20">
                <div className="rmm-section-header mb-0 border-none pb-0">
                    <span className="rmm-section-title">Registro de Movimiento</span>
                    <span className="rmm-section-id">INV_CMD_01</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <Field label="Nodo de Origen" required id="SRC_WH" error={errors.warehouse_id?.message}>
                    <select {...form.register("warehouse_id", { valueAsNumber: true })} className={fieldClass}>
                        <option value={0}>[ SELECCIONAR ALMACÉN ]</option>
                        {warehouseOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Identificador de Recurso" required id="RES_ID" error={errors.resource_id?.message}>
                    <select {...form.register("resource_id", { valueAsNumber: true })} className={fieldClass}>
                        <option value={0}>[ SELECCIONAR RECURSO ]</option>
                        {resourceOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Operación" required id="OPS_TYPE" error={errors.movement_type?.message}>
                        <select {...form.register("movement_type")} className={fieldClass}>
                            <option value="E">ENTRADA (IN)</option>
                            <option value="S">SALIDA (OUT)</option>
                            <option value="A">AJUSTE (ADJ)</option>
                        </select>
                    </Field>

                    {movementType === "A" && (
                        <Field label="Dirección" required id="ADJ_SIGN" error={errors.adjustment_sign?.message}>
                            <select {...form.register("adjustment_sign")} className={fieldClass}>
                                <option value="">[ SELECT ]</option>
                                <option value="+">INCREMENT (+)</option>
                                <option value="-">DECREMENT (-)</option>
                            </select>
                        </Field>
                    )}
                </div>

                <Field label="Volumen de Carga" required id="VOL_VAL" error={errors.amount?.message}>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...form.register("amount", { valueAsNumber: true })}
                        className={fieldClass}
                        placeholder="0.00"
                    />
                </Field>

                <Field label="Bitácora / Justificación" id="LOG_REF" error={errors.reason?.message}>
                    <textarea
                        {...form.register("reason")}
                        rows={3}
                        className={`${fieldClass} resize-none`}
                        placeholder="Detalles del protocolo..."
                    />
                </Field>
            </div>

            <footer className="px-6 py-6 border-t border-border-default bg-bg-secondary/10 flex gap-3">
                <button
                    type="button"
                    onClick={handleClear}
                    disabled={isSubmitting}
                    className="flex-1 rmm-btn border border-border-strong hover:bg-bg-secondary transition-all disabled:opacity-50"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="font-mono">Reset</span>
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-2 rmm-btn rmm-btn-accent justify-center transition-all disabled:opacity-50"
                >
                    <Save className="h-3.5 w-3.5" />
                    <span className="font-mono">{isSubmitting ? "Comitting..." : "Commit Transaction"}</span>
                </button>
            </footer>
        </form>
    );
}

