import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw, Save, Shield, Trash2 } from "lucide-react";
import { resourceSchema, EMPTY_RESOURCE, type ResourceFormInput, type ResourceFormValues } from '../schemas/resource.schema';

type Props = {
    initialData?: ResourceFormValues;
    onSave: (payload: ResourceFormValues) => Promise<boolean>;
    onUpdate?: (id: number, payload: Partial<ResourceFormValues>) => Promise<boolean>;
    onDelete?: (item: ResourceFormValues) => Promise<void>;
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

export function ResourceForm({
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
    } = useForm<ResourceFormInput, undefined, ResourceFormValues>({
        resolver: zodResolver(resourceSchema),
        defaultValues: initialData ?? EMPTY_RESOURCE,
    });

    const onSubmit = async (data: ResourceFormValues) => {
        if (isEditMode && initialData?.id && onUpdate) {
            const payload = Object.fromEntries(
                Object.entries(data).filter(([key]) => dirtyFields[key as keyof ResourceFormValues])
            ) as Partial<ResourceFormValues>;

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
        reset(initialData ?? EMPTY_RESOURCE);
        onClear?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-default bg-bg-secondary/50">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em]">
                    <Shield size={14} className="text-accent" />
                    {isEditMode ? `ID: ${initialData?.id}` : "Nuevo Recurso"}
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
                        <input {...register('code')} className={fieldClassName} placeholder="R-XXX" />
                    </Field>
                </div>

                <Field label="Nombre" required error={errors.name?.message}>
                    <input {...register('name')} className={fieldClassName} placeholder="Nombre oficial del recurso..." />
                </Field>

                <Field label="Descripcion" error={errors.description?.message}>
                    <textarea
                        {...register('description')}
                        rows={2}
                        className={`${fieldClassName} resize-none`}
                        placeholder="Detalles adicionales sobre el recurso..."
                    />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Categoria" required error={errors.category?.message}>
                        <input {...register('category')} className={fieldClassName} placeholder="Ej: ALIMENTO, MEDICINA..." />
                    </Field>

                    <Field label="Unidad" required error={errors.unitOfMeasure?.message}>
                        <select {...register('unitOfMeasure')} className={fieldClassName}>
                            <option value="">SELECCIONAR</option>
                            <option value="UNIDAD">UNIDAD</option>
                            <option value="KG">KG</option>
                            <option value="LT">LT</option>
                            <option value="TON">TON</option>
                        </select>
                    </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Estado" required error={errors.state?.message}>
                        <select {...register('state')} className={fieldClassName}>
                            <option value="A">ACTIVO</option>
                            <option value="I">INACTIVO</option>
                        </select>
                    </Field>

                    <Field label="Consumible">
                        <div className="flex items-center h-[42px] px-3 bg-bg-tertiary border border-border-default">
                            <input
                                type="checkbox"
                                {...register('consumable')}
                                className="w-4 h-4 accent-accent"
                            />
                            <span className="ml-3 font-mono text-[10px] text-txt-secondary uppercase tracking-widest leading-none">
                                Es consumible
                            </span>
                        </div>
                    </Field>
                </div>

                {initialData?.created_at ? (
                    <div className="px-3 py-2 bg-status-info/10 border border-status-info/20 text-[10px] font-mono text-status-info uppercase tracking-widest italic">
                        FECHA ALTA: {new Date(initialData.created_at).toLocaleString()}
                    </div>
                ) : null}
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