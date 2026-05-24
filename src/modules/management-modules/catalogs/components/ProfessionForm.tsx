import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw, Save, Shield, Trash2 } from "lucide-react";
import { professionSchema, EMPTY_PROFESSION, type ProfessionFormInput, type ProfessionFormValues } from '../schemas/profession.schema';

type ResourceOption = {
    id: number;
    label: string;
};

type Props = {
    initialData?: ProfessionFormValues;
    resourceOptions?: ResourceOption[];
    onSave: (payload: ProfessionFormValues) => Promise<boolean>;
    onUpdate?: (id: number, payload: Partial<ProfessionFormValues>) => Promise<boolean>;
    onDelete?: (item: ProfessionFormValues) => Promise<void>;
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

export function ProfessionForm({
    initialData,
    resourceOptions = [],
    onSave,
    onUpdate,
    onDelete,
    onClear,
}: Props) {
    const isEditMode = Boolean(initialData?.id);

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, dirtyFields, isSubmitting },
    } = useForm<ProfessionFormInput, undefined, ProfessionFormValues>({
        resolver: zodResolver(professionSchema),
        defaultValues: initialData ?? EMPTY_PROFESSION,
    });

    useEffect(() => {
        reset(initialData ?? EMPTY_PROFESSION);
    }, [initialData, reset]);

    const onSubmit = async (data: ProfessionFormValues) => {
        if (isEditMode && initialData?.id && onUpdate) {
            const payload = Object.fromEntries(
                Object.entries(data).filter(([key]) => dirtyFields[key as keyof ProfessionFormValues])
            ) as Partial<ProfessionFormValues>;

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
            reset(EMPTY_PROFESSION);
        }
    };

    const handleClear = () => {
        reset(initialData ?? EMPTY_PROFESSION);
        onClear?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-default bg-bg-secondary/50">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em]">
                    <Shield size={14} className="text-accent" />
                    {isEditMode ? `ID: ${initialData?.id}` : "Nueva Profesión"}
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
                        <input {...register('code')} className={fieldClassName} placeholder="P-XXX" />
                    </Field>
                </div>

                <Field label="Nombre" required error={errors.name?.message}>
                    <input {...register('name')} className={fieldClassName} placeholder="Nombre de la profesión..." />
                </Field>

                <Field label="Descripcion" error={errors.description?.message}>
                    <textarea
                        {...register('description')}
                        rows={2}
                        className={`${fieldClassName} resize-none`}
                        placeholder="Descripción de tareas y responsabilidades..."
                    />
                </Field>

                <div className="relative p-4 bg-bg-tertiary/30 border border-border-default/50 space-y-4">
                    <div className="text-[10px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em] -mt-1 mb-2">
                        Configuración de Producción
                    </div>
                    
                    <Field label="Recurso Base" error={errors.default_resource_id?.message}>
                        <Controller
                            control={control}
                            name="default_resource_id"
                            render={({ field }) => (
                                <select
                                    className={fieldClassName}
                                    value={field.value ?? ''}
                                    onChange={(event) => field.onChange(event.target.value ? Number(event.target.value) : null)}
                                >
                                    <option value="">SIN RECURSO ASIGNADO</option>
                                    {resourceOptions.map((resource) => (
                                        <option key={resource.id} value={resource.id}>
                                            {resource.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                    </Field>

                    <Field label="Cantidad x Jornada" error={errors.default_production_amount?.message}>
                        <Controller
                            control={control}
                            name="default_production_amount"
                            render={({ field }) => (
                                <input
                                    type="number"
                                    min="1"
                                    className={fieldClassName}
                                    value={field.value ?? ''}
                                    onChange={(event) => field.onChange(event.target.value ? Number(event.target.value) : null)}
                                />
                            )}
                        />
                    </Field>
                </div>
                
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