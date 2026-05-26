import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { minStockConfigSchema, type MinStockConfigFormValues } from "../schemas/min-stock-config.schema";

type Props = {
    initialData?: Partial<MinStockConfigFormValues>;
    warehouseOptions: { id: number; label: string }[];
    resourceOptions: { id: number; label: string }[];
    isSubmitting?: boolean;
    onSubmit: (values: MinStockConfigFormValues) => Promise<void>;
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

const EMPTY_MIN_STOCK = {
    warehouse_id: 0,
    resource_id: 0,
    min_quantity: 0,
} satisfies MinStockConfigFormValues;

export function MinStockConfigForm({
    initialData,
    warehouseOptions,
    resourceOptions,
    isSubmitting = false,
    onSubmit,
    onClear,
}: Props) {
    const form = useForm<MinStockConfigFormValues>({
        resolver: zodResolver(minStockConfigSchema),
        mode: 'onChange',
        defaultValues: { ...EMPTY_MIN_STOCK, ...initialData },
    });
    const errors = form.formState.errors;

    useEffect(() => {
        form.reset({ ...EMPTY_MIN_STOCK, ...initialData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    const handleClear = () => {
        form.reset(EMPTY_MIN_STOCK);
        onClear();
    };

    return (
        <form
            onSubmit={form.handleSubmit(async (values) => onSubmit(values))}
            className="flex flex-1 min-h-0 flex-col relative"
        >
             <header className="px-6 py-4 border-b border-border-default bg-bg-secondary/20 shrink-0">
                <div className="rmm-section-header mb-0 border-none pb-0">
                    <span className="rmm-section-title">Stock de Seguridad</span>
                    <span className="rmm-section-id">INV_CFG_STK</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <Field label="Nodo de Almacén" required id="WH_LOC" error={errors.warehouse_id?.message}>
                    <select {...form.register("warehouse_id", { valueAsNumber: true })} className={fieldClass}>
                        <option value={0}>[ SELECCIONAR ALMACÉN ]</option>
                        {warehouseOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Recurso Base" required id="RES_TARGET" error={errors.resource_id?.message}>
                    <select {...form.register("resource_id", { valueAsNumber: true })} className={fieldClass}>
                        <option value={0}>[ SELECCIONAR RECURSO ]</option>
                        {resourceOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Umbral de Alerta" required id="MIN_LVL" error={errors.min_quantity?.message}>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        {...form.register("min_quantity", { valueAsNumber: true })}
                        className={fieldClass}
                        placeholder="0.00"
                    />
                </Field>

                <div className="p-4 bg-status-info/5 border border-status-info/20 font-mono text-[10px] text-txt-muted leading-relaxed">
                    <span className="text-status-info font-bold uppercase tracking-wider block mb-1">PROT_ALRT_SYSTEM:</span>
                    Se generará una notificación automática si el nivel de stock desciende por debajo del umbral definido.
                </div>
            </div>

            <footer className="px-6 py-6 border-t border-border-default bg-bg-secondary/10 flex gap-2 shrink-0">
                <button
                    type="button"
                    onClick={handleClear}
                    disabled={isSubmitting}
                    className="flex-1 rmm-btn border border-border-default bg-bg-tertiary text-txt-secondary hover:text-txt-primary transition-all disabled:opacity-50"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="font-mono">Limpiar</span>
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rmm-btn rmm-btn-accent justify-center transition-all disabled:opacity-50"
                >
                    <Save className="h-3.5 w-3.5" />
                    <span className="font-mono">{isSubmitting ? "..." : "Guardar"}</span>
                </button>
            </footer>
        </form>
    );
}
