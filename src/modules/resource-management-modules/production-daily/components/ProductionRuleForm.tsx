import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Save, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ProfessionSearchPicker } from "../../shared/components/ProfessionSearchPicker";
import { ResourceSearchPicker } from "../../shared/components/ResourceSearchPicker";
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
    const selectedProfessionId = useWatch({ control: form.control, name: "profession_id" }) ?? 0;
    const selectedResourceId = useWatch({ control: form.control, name: "resource_id" }) ?? 0;

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
            <header className="px-6 py-4 border-b border-border-default bg-bg-secondary/20  backdrop-blur-lg shrink-0">
                    <span className="app-section-title font-abril">Production Parameters</span>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <Field label="Required Profession" required id="" error={errors.profession_id?.message}>
                    <input type="hidden" {...form.register("profession_id", { valueAsNumber: true })} />
                    <ProfessionSearchPicker
                        selectedId={selectedProfessionId}
                        onChange={(id) => form.setValue("profession_id", id, { shouldDirty: true, shouldValidate: true })}
                        options={professionOptions}
                    />
                </Field>

                <Field label="Resource to Generate" required id="" error={errors.resource_id?.message}>
                    <input type="hidden" {...form.register("resource_id", { valueAsNumber: true })} />
                    <ResourceSearchPicker
                        selectedId={selectedResourceId}
                        onChange={(id) => form.setValue("resource_id", id, { shouldDirty: true, shouldValidate: true })}
                        options={resourceOptions}
                    />
                </Field>

                <Field label="Estimated Daily Quota" required id="" error={errors.expected_amount?.message}>
                    <input
                        type="number"
                        {...form.register("expected_amount", { valueAsNumber: true })}
                        placeholder="0"
                        min={1}
                        className={fieldClass}
                    />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="From" required id="" error={errors.effective_date?.message}>
                        <input
                            type="date"
                            {...form.register("effective_date")}
                            className={fieldClass}
                        />
                    </Field>

                    <Field label="To" id="" error={errors.end_date?.message}>
                        <input
                            type="date"
                            {...form.register("end_date")}
                            className={fieldClass}
                        />
                    </Field>
                </div>

                <Field label="Status:" required id="" error={errors.state?.message}>
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
                        className="app-btn app-btn--danger app-btn--sm"
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
                    <span className="font-mono">{isSubmitting ? "..." : initialData?.camp_id ? "UPDATE" : "SAVE"}</span>
                </button>
            </footer>
        </form>
    );
}
