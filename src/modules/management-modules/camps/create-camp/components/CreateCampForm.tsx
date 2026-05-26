import { zodResolver } from "@hookform/resolvers/zod";
import { Database, RotateCcw, Save, Shield, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { EMPTY_CAMP_FORM, createCampSchema, type CampFormValues } from "../schemas/create-camp.schema";
import type { CampAdminOption } from "../schemas/user.schema";

type CreateCampFormProps = {
    initialData?: CampFormValues;
    adminOptions: CampAdminOption[];
    isSubmitting?: boolean;
    onSave: (values: CampFormValues) => Promise<boolean>;
    onUpdate?: (id: number, values: Partial<CampFormValues>) => Promise<boolean>;
    onDelete: (values: CampFormValues) => Promise<void>;
    onClear: () => void;
};

const fieldClassName =
    "bg-bg-tertiary border border-border-default px-3 py-2.5 font-mono text-xs text-txt-primary focus:border-accent outline-none transition-all placeholder:text-txt-disabled/30 w-full";

function formatCampDate(value?: string | null) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}

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
            <span className="flex items-center justify-between gap-3 text-[14px] font-ibmplex font-bold uppercase tracking-widest">
                <span className={required ? "text-status-critical" : "text-txt-disabled"}>{label}</span>
                {error ? <span className="text-[11px] normal-case tracking-normal text-status-critical">{error}</span> : null}
            </span>
            {children}
        </label>
    );
}

export function CreateCampForm({
    initialData,
    adminOptions,
    isSubmitting = false,
    onSave,
    onUpdate,
    onDelete,
    onClear,
}: CreateCampFormProps) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        getValues,
        formState: { errors, isDirty, dirtyFields, isSubmitting: formIsSubmitting },
    } = useForm<CampFormValues>({
        resolver: zodResolver(createCampSchema as never),
        defaultValues: initialData ?? EMPTY_CAMP_FORM,
    });
    const watchedCode = useWatch({ control, name: "code" }) as string | undefined;
    const isEditMode = initialData?.id != null;
    const busy = isSubmitting || formIsSubmitting;

    useEffect(() => {
        reset(initialData ?? EMPTY_CAMP_FORM);
    }, [initialData, reset]);

    const submitHandler = async (submittedValues: CampFormValues) => {
        if (isEditMode && initialData?.id && onUpdate) {
            const payload = Object.fromEntries(
                Object.entries(submittedValues).filter(([key]) => dirtyFields[key as keyof CampFormValues]),
            ) as Partial<CampFormValues>;

            if (Object.keys(payload).length === 0) {
                return;
            }

            const ok = await onUpdate(initialData.id, payload);
            if (ok) {
                onClear();
            }
            return;
        }

        const ok = await onSave(submittedValues);
        if (ok) {
            reset(EMPTY_CAMP_FORM);
        }
    };

    const handleClear = () => {
        reset(initialData ?? EMPTY_CAMP_FORM);
        onClear();
    };

    return (
        <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex h-full flex-col"
        >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-default bg-bg-secondary/50">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em]">
                    <Shield size={14} className="text-accent" />
                    {isEditMode ? `ID: ${initialData?.id}` : "Nuevo Campamento"}
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:block px-2 py-0.5 font-mono text-[9px] font-bold text-txt-disabled uppercase tracking-widest">
                        Registro de Campamentos
                    </div>
                    <div className="hidden sm:block px-2 py-0.5 font-mono text-[9px] font-bold text-status-info border border-status-info/30 bg-status-info/10 uppercase tracking-widest">
                        ADMINS DISPONIBLES: {String(adminOptions.length).padStart(2, "0")}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="ID Sistema">
                        <input
                            value={isEditMode ? String(initialData?.id ?? "") : "AUTO"}
                            readOnly
                            className="bg-bg-tertiary/30 border border-border-subtle px-3 py-2.5 font-mono text-xs text-txt-disabled outline-none cursor-not-allowed"
                        />
                    </Field>

                    <Field label="Codigo" required error={errors.code?.message}>
                        <input {...register("code")} className={fieldClassName} placeholder="CAMP-XXX" />
                    </Field>
                </div>

                <Field label="Descripcion" required error={errors.description?.message}>
                    <textarea
                        {...register("description")}
                        rows={2}
                        className={`${fieldClassName} resize-none`}
                        placeholder="Describe el proposito y objetivos del campamento..."
                    />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Capacidad Maxima" required error={errors.capacity?.message}>
                        <input type="number" min="1" {...register("capacity")} className={fieldClassName} />
                    </Field>

                    <Field label="Estado" required error={errors.state?.message}>
                        <select {...register("state")} className={fieldClassName}>
                            <option value="A">ACTIVO</option>
                            <option value="I">INACTIVO</option>
                        </select>
                    </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Longitud (X)" error={errors.location_x?.message}>
                        <Controller
                            control={control}
                            name="location_x"
                            render={({ field }) => (
                                <input
                                    type="number"
                                    value={field.value ?? ""}
                                    onChange={(event) => field.onChange(event.target.value)}
                                    className={fieldClassName}
                                />
                            )}
                        />
                    </Field>

                    <Field label="Latitud (Y)" error={errors.location_y?.message}>
                        <Controller
                            control={control}
                            name="location_y"
                            render={({ field }) => (
                                <input
                                    type="number"
                                    value={field.value ?? ""}
                                    onChange={(event) => field.onChange(event.target.value)}
                                    className={fieldClassName}
                                />
                            )}
                        />
                    </Field>
                </div>

                <Field label="Administrador" error={errors.admin_id?.message}>
                    <Controller
                        control={control}
                        name="admin_id"
                        render={({ field }) => (
                            <select
                                className={fieldClassName}
                                value={field.value ?? ""}
                                onChange={(event) => field.onChange(event.target.value)}
                            >
                                <option value="">SIN ADMINISTRADOR ASIGNADO</option>
                                {adminOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                </Field>

                {!isEditMode ? (
                    <div className="relative p-5 bg-bg-secondary border border-border-default overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Database className="text-status-info" size={16} />
                                <div className="text-[11px] font-mono font-bold text-txt-primary uppercase tracking-widest">
                                    Almacen Inicial
                                </div>
                            </div>
                            <div className="px-2 py-0.5 text-[9px] font-mono font-bold text-status-info border border-status-info/30 bg-status-info/5 uppercase tracking-widest">
                                Requerido
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Nombre del Almacen" required error={errors.warehouse_name?.message}>
                                <input
                                    {...register("warehouse_name")}
                                    placeholder={String(watchedCode ?? "").trim() ? `ALM-${String(watchedCode).trim().toUpperCase()}` : "ALMACEN-PRINCIPAL"}
                                    className={fieldClassName}
                                />
                            </Field>

                            <Field
                                label="Detalles de Ubicacion"
                                error={errors.warehouse_location_details?.message}
                            >
                                <input
                                    {...register("warehouse_location_details")}
                                    placeholder="Sector, modulo o ID interno..."
                                    className={fieldClassName}
                                />
                            </Field>
                        </div>
                    </div>
                ) : null}

                {initialData?.created_at ? (
                    <div className="px-3 py-2 bg-status-info/10 border border-status-info/20 text-[10px] font-mono text-status-info uppercase tracking-widest italic">
                        CREADO EN: {formatCampDate(initialData.created_at)}
                    </div>
                ) : null}
            </div>

            <div className="flex flex-col gap-3 p-5 bg-bg-secondary border-t border-border-default">
                <button
                    type="submit"
                    disabled={busy || (isEditMode ? !isDirty : false)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-hover text-accent-fg font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(232,93,4,0.3)] disabled:opacity-50"
                >
                    <Save size={14} />
                    {busy ? "PROCESANDO..." : isEditMode ? "ACTUALIZAR" : "REGISTRAR"}
                </button>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={handleClear}
                        disabled={busy}
                        className="w-full flex items-center justify-center gap-2 py-3 border border-border-default hover:border-txt-disabled text-txt-secondary hover:text-txt-primary font-mono text-xs font-bold uppercase tracking-widest transition-all"
                    >
                        <RotateCcw size={12} /> LIMPIAR
                    </button>
                    <button
                        type="button"
                        disabled={busy || !isEditMode}
                        onClick={async () => onDelete(initialData ?? getValues())}
                        className="w-full flex items-center justify-center gap-2 py-3 border border-status-critical/30 text-status-critical hover:bg-status-critical/10 font-mono text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                        <Trash2 size={12} /> ELIMINAR
                    </button>
                </div>
            </div>
        </form>
    );
}
