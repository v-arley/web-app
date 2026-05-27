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
    onDelete?: (rule: ProductionRuleFormValues) => void;
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
        mode: 'onChange',
        defaultValues: { ...EMPTY_PRODUCTION_RULE, ...initialData },
    });
    const errors = form.formState.errors;

    useEffect(() => {
        form.reset({ ...EMPTY_PRODUCTION_RULE, ...initialData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    const handleClear = () => {
        form.reset(EMPTY_PRODUCTION_RULE);
        onClear();
    };

    return (
        <form
            onSubmit={form.handleSubmit(async (values) => onSubmit(values))}
            className="flex flex-1 min-h-0 flex-col relative"
        >
            <header className="px-6 py-4 border-b border-border-default bg-bg-secondary/20 shrink-0">
                <div className="rmm-section-header mb-0 border-none pb-0">
                    <span className="rmm-section-title">Production Parameters</span>
                    <span className="rmm-section-id">PRD_RULE_CMD</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <Field label="Required Profession" required id="PROF_CODE" error={errors.profession_id?.message}>
                    <select {...form.register("profession_id", { valueAsNumber: true })} className={fieldClass}>
                        <option value={0}>[ SELECT PROFESSION ]</option>
                        {professionOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Resource to Generate" required id="RES_OUTPUT" error={errors.resource_id?.message}>
                    <select {...form.register("resource_id", { valueAsNumber: true })} className={fieldClass}>
                        <option value={0}>[ SELECT RESOURCE ]</option>
                        {resourceOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Estimated Daily Quota" required id="EXP_QTY" error={errors.expected_amount?.message}>
                    <input
                        type="number"
                        {...form.register("expected_amount", { valueAsNumber: true })}
                        placeholder="0"
                        min={1}
                        className={fieldClass}
                    />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="From" required id="START_DT" error={errors.effective_date?.message}>
                        <input
                            type="date"
                            {...form.register("effective_date")}
                            className={fieldClass}
                        />
                    </Field>

                    <Field label="To" id="END_DT" error={errors.end_date?.message}>
                        <input
                            type="date"
                            {...form.register("end_date")}
                            className={fieldClass}
                        />
                    </Field>
                </div>

                <Field label="Operational Protocol" required id="STATUS" error={errors.state?.message}>
                    <select {...form.register("state")} className={fieldClass}>
                        <option value="A">ACTIVE (A)</option>
                        <option value="I">INACTIVE (I)</option>
                    </select>
                </Field>
            </div>

            <footer className="px-6 py-6 border-t border-border-default bg-bg-secondary/10 flex gap-2 shrink-0">
                {initialData?.camp_id && initialData?.profession_id && initialData?.resource_id && initialData?.effective_date && onDelete && (
                    <button
                        type="button"
                        onClick={() => onDelete(initialData as ProductionRuleFormValues)}
                        disabled={isSubmitting}
                        className="rmm-btn border border-status-critical/30 bg-status-critical/5 text-status-critical hover:bg-status-critical/15 px-3 disabled:opacity-30"
                        title="Delete rule"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="font-mono">DELETE</span>
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleClear}
                    disabled={isSubmitting}
                    className="flex-1 rmm-btn border border-border-default bg-bg-tertiary text-txt-secondary hover:bg-bg-secondary hover:text-txt-primary transition-all disabled:opacity-50"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="font-mono">CLEAR</span>
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rmm-btn rmm-btn-accent justify-center transition-all disabled:opacity-50"
                >
                    <Save className="h-3.5 w-3.5" />
                    <span className="font-mono">{isSubmitting ? "..." : initialData?.camp_id ? "UPDATE" : "SAVE"}</span>
                </button>
            </footer>
        </form>
    );
}
