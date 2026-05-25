import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Save, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { productionRuleSchema, type ProductionRuleFormInput, type ProductionRuleFormValues, EMPTY_PRODUCTION_RULE } from "../schemas/production-rule.schema";

type Props = {
    initialData?: Partial<ProductionRuleFormValues>;
    professionOptions: { id: number; label: string }[];
    resourceOptions: { id: number; label: string }[];
    isSubmitting?: boolean;
    onSubmit: (values: ProductionRuleFormValues) => Promise<void>;
    onClear: () => void;
    onDelete?: (id: number) => void;
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

export function ProductionRuleForm({
    initialData,
    professionOptions,
    resourceOptions,
    isSubmitting = false,
    onSubmit,
    onClear,
    onDelete,
}: Props) {
    const form = useForm<ProductionRuleFormInput, undefined, ProductionRuleFormValues>({
        resolver: zodResolver(productionRuleSchema),
        defaultValues: { ...EMPTY_PRODUCTION_RULE, ...initialData },
    });
    const errors = form.formState.errors;

    useEffect(() => {
        form.reset({ ...EMPTY_PRODUCTION_RULE, ...initialData });
    }, [form, initialData]);

    const handleClear = () => {
        form.reset(EMPTY_PRODUCTION_RULE);
        onClear();
    };

    return (
        <form
            onSubmit={form.handleSubmit(async (values) => onSubmit(values))}
            className="flex h-full flex-col"
        >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-default bg-bg-secondary/50">
                <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em]">
                    {initialData?.id ? 'Editar' : 'Nueva'} Regla
                </div>
                <div className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest">
                    Producción Diaria
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <Field label="Profesión" required error={errors.profession_id?.message}>
                    <select {...form.register("profession_id", { valueAsNumber: true })} className={fieldClass}>
                        <option value={0}>[ SELECCIONAR PROFESIÓN ]</option>
                        {professionOptions.map((opt) => (
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

                <Field label="Cantidad Esperada/Día" required error={errors.expected_amount?.message}>
                    <input
                        type="number"
                        {...form.register("expected_amount", { valueAsNumber: true })}
                        placeholder="0"
                        min={1}
                        className={fieldClass}
                    />
                </Field>

                <Field label="Fecha de Inicio" required error={errors.effective_date?.message}>
                    <input
                        type="date"
                        {...form.register("effective_date")}
                        className={fieldClass}
                    />
                </Field>

                <Field label="Fecha de Fin (Opcional)" error={errors.end_date?.message}>
                    <input
                        type="date"
                        {...form.register("end_date")}
                        className={fieldClass}
                    />
                </Field>

                <Field label="Estado" required error={errors.state?.message}>
                    <select {...form.register("state")} className={fieldClass}>
                        <option value="A">Activa</option>
                        <option value="I">Inactiva</option>
                    </select>
                </Field>
            </div>

            <div className="border-t border-border-default bg-bg-secondary/30 px-5 py-3 flex gap-2">
                {initialData?.id && onDelete && (
                    <button
                        type="button"
                        onClick={() => onDelete(initialData.id!)}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-1.5 bg-status-critical/10 border border-status-critical/30 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-status-critical hover:bg-status-critical/20 transition-all disabled:opacity-50"
                        title="Eliminar regla"
                    >
                        <Trash2 className="w-3 h-3" />
                        Del
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleClear}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-bg-tertiary border border-border-default px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-txt-secondary hover:bg-bg-secondary hover:text-txt-primary transition-all disabled:opacity-50"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Limpiar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-accent border border-accent px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-bg-primary hover:bg-accent/90 transition-all disabled:opacity-50"
                >
                    <Save className="w-3.5 h-3.5" />
                    {isSubmitting ? "..." : initialData?.id ? "Actualizar" : "Guardar"}
                </button>
            </div>
        </form>
    );
}
