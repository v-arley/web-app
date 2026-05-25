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
    "bg-bg-tertiary border border-border-default px-3 py-2.5 font-mono text-[11px] text-txt-primary focus:border-accent outline-none transition-all placeholder:text-txt-muted/50 w-full";

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
                <span className={required ? "text-accent" : "text-txt-secondary"}>{label}</span>
                {error ? <span className="text-accent normal-case tracking-normal">{error}</span> : null}
            </span>
            {children}
        </label>
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
        defaultValues: { ...EMPTY_MIN_STOCK, ...initialData },
    });
    const errors = form.formState.errors;

    useEffect(() => {
        form.reset({ ...EMPTY_MIN_STOCK, ...initialData });
    }, [form, initialData]);

    const handleClear = () => {
        form.reset(EMPTY_MIN_STOCK);
        onClear();
    };

    return (
        <form
            onSubmit={form.handleSubmit(async (values) => onSubmit(values))}
            className="flex h-full flex-col"
        >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-default bg-bg-secondary/50">
                <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em]">
                    Configurar Mínimos
                </div>
                <div className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest">
                    Stock de Seguridad
                </div>
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

                <Field label="Cantidad Mínima" required error={errors.min_quantity?.message}>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        {...form.register("min_quantity", { valueAsNumber: true })}
                        className={fieldClass}
                        placeholder="0.00"
                    />
                </Field>

                <div className="px-4 py-3 bg-status-info/10 border border-status-info/30 font-mono text-[10px] text-txt-secondary leading-relaxed">
                    <span className="font-bold text-status-info">NOTA:</span> Si la cantidad actual es menor al mínimo configurado,
                    se generará automáticamente una alerta en el sistema.
                </div>
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
