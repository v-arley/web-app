import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw, Save, Shield, Trash2 } from "lucide-react";
import { achievementSchema, EMPTY_ACHIEVEMENT, type AchievementFormInput, type AchievementFormValues } from '../schemas/achievement.schema';

type Props = {
    initialData?: AchievementFormValues;
    onSave: (payload: AchievementFormValues) => Promise<boolean>;
    onUpdate?: (id: number, payload: Partial<AchievementFormValues>) => Promise<boolean>;
    onDelete?: (item: AchievementFormValues) => Promise<void>;
    onClear?: () => void;
};

const fieldClassName =
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
            <span className="flex items-center justify-between gap-3 text-[11px] font-mono font-bold uppercase tracking-widest">
                <span className={required ? "text-accent" : "text-txt-disabled"}>{label}</span>
                {error ? <span className="text-[10px] normal-case tracking-normal text-status-critical font-bold transition-all">{error}</span> : null}
            </span>
            {children}
        </label>
    );
}

export function AchievementForm({
    initialData,
    onSave,
    onUpdate,
    onDelete,
    onClear,
}: Props) {
    const isEditMode = Boolean(initialData?.id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, dirtyFields, isSubmitting },
    } = useForm<AchievementFormInput, undefined, AchievementFormValues>({
        resolver: zodResolver(achievementSchema),
        defaultValues: initialData ?? EMPTY_ACHIEVEMENT,
    });

    const onSubmit = async (data: AchievementFormValues) => {
        if (isEditMode && initialData?.id && onUpdate) {
            const payload = Object.fromEntries(
                Object.entries(data).filter(([key]) => dirtyFields[key as keyof AchievementFormValues])
            ) as Partial<AchievementFormValues>;

            if (Object.keys(payload).length === 0) {
                return;
            }

            const ok = await onUpdate(initialData.id, payload);
            if (ok) {
                onClear?.();
            }
            return;
        }

        const ok = await onSave(data);
        if (ok) {
            reset(EMPTY_RESOURCE);
        }
    };

    const handleClear = () => {
        reset(initialData ?? EMPTY_ACHIEVEMENT);
        onClear?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-default bg-bg-secondary/50">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em]">
                    <Shield size={14} className="text-accent" />
                    {isEditMode ? `ID: ${initialData?.id}` : "Nuevo Logro"}
                </div>
                <div className="px-2 py-0.5 font-mono text-[9px] font-bold text-txt-disabled border border-border-default/50 uppercase tracking-widest">
                    Catalog Entry
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-bg-primary/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="ID">
                        <input
                            value={isEditMode ? String(initialData?.id ?? "") : "AUTO"}
                            readOnly
                            className="bg-bg-tertiary/30 border border-border-subtle px-3 py-2.5 font-mono text-xs text-txt-disabled outline-none cursor-not-allowed"
                        />
                    </Field>

                    <Field label="Codigo" required error={errors.code?.message}>
                        <input {...register('code')} className={fieldClassName} placeholder="ACH-XXX" />
                    </Field>
                </div>

                <Field label="Nombre" required error={errors.name?.message}>
                    <input {...register('name')} className={fieldClassName} placeholder="Nombre del logro/mérito..." />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Categoria" error={errors.category?.message}>
                        <input {...register('category')} className={fieldClassName} placeholder="Ej: Supervivencia, Combate..." />
                    </Field>

                    <Field label="Puntos" required error={errors.points?.message}>
                        <input type="number" {...register('points', { valueAsNumber: true })} className={fieldClassName} />
                    </Field>
                </div>

                <Field label="Condicion Logica" required error={errors.condition_logic?.message}>
                    <textarea
                        {...register('condition_logic')}
                        rows={2}
                        className={`${fieldClassName} resize-none`}
                        placeholder="Ej: total_kills > 100 && survival_days >= 10..."
                    />
                </Field>

                <Field label="Descripcion" error={errors.description?.message}>
                    <textarea
                        {...register('description')}
                        rows={2}
                        className={`${fieldClassName} resize-none`}
                        placeholder="Descripción narrativa del logro..."
                    />
                </Field>
                
                <Field label="Estado" required error={errors.state?.message}>
                    <select {...register('state')} className={fieldClassName}>
                        <option value="A">ACTIVO</option>
                        <option value="I">INACTIVO</option>
                    </select>
                </Field>
            </div>

            <div className="flex flex-col gap-3 p-5 bg-bg-secondary border-t border-border-default">
                <button
                    type="submit"
                    disabled={isSubmitting || (isEditMode ? !isDirty : false)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-hover text-accent-fg font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(232,93,4,0.3)] disabled:opacity-50"
                >
                    <Save size={14} />
                    {isSubmitting ? "PROCESANDO..." : isEditMode ? "ACTUALIZAR" : "REGISTRAR"}
                </button>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={handleClear}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3 border border-border-default hover:border-txt-disabled text-txt-secondary hover:text-txt-primary font-mono text-xs font-bold uppercase tracking-widest transition-all"
                    >
                        <RotateCcw size={12} /> LIMPIAR
                    </button>
                    <button
                        type="button"
                        disabled={isSubmitting || !isEditMode}
                        onClick={() => initialData && onDelete?.(initialData)}
                        className="w-full flex items-center justify-center gap-2 py-3 border border-status-critical/30 text-status-critical hover:bg-status-critical/10 font-mono text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                        <Trash2 size={12} /> ELIMINAR
                    </button>
                </div>
            </div>
        </form>
    );
}