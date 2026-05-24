import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Save, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm, useWatch, type FieldValues } from "react-hook-form";
import { EMPTY_ACHIEVEMENT, achievementSchema, type AchievementFormValues } from "../schemas/achievement.schema";
import { EMPTY_PROFESSION, professionSchema, type ProfessionFormValues } from "../schemas/profession.schema";
import { EMPTY_RESOURCE, resourceSchema, type ResourceFormValues } from "../schemas/resource.schema";
import type { CatalogTab } from "./CatalogsToolbar";

type ResourceOption = {
    id: number;
    label: string;
};

type CatalogRecord = ProfessionFormValues | ResourceFormValues | AchievementFormValues;

type CatalogsFormProps = {
    tab: CatalogTab;
    initialData?: CatalogRecord;
    resourceOptions?: ResourceOption[];
    isSubmitting?: boolean;
    onSubmit: (values: CatalogRecord) => Promise<void>;
    onDelete: (values: CatalogRecord) => Promise<void>;
    onClear: () => void;
};

const RESOURCE_UNITS = ["UNIDAD", "KG", "LT", "TON", "KIT", "CAJA", "METRO"];
const RESOURCE_CATEGORIES = ["ALIMENTO", "AGUA", "MEDICINA", "MUNICION", "HERRAMIENTA"];
const ACHIEVEMENT_CATEGORIES = ["EXPLORADOR", "PRODUCTOR", "SOBREVIVIENTE", "LIDER"];

const fieldClassName =
    "bg-bg-tertiary border border-border-default px-3 py-2.5 font-mono text-xs text-txt-primary focus:border-accent outline-none transition-all placeholder:text-txt-disabled/30 w-full";

function getEmptyRecord(tab: CatalogTab) {
    switch (tab) {
        case "professions":
            return EMPTY_PROFESSION;
        case "resources":
            return EMPTY_RESOURCE;
        case "achievements":
            return EMPTY_ACHIEVEMENT;
    }
}

function getCatalogSchema(tab: CatalogTab) {
    switch (tab) {
        case "professions":
            return professionSchema;
        case "resources":
            return resourceSchema;
        case "achievements":
            return achievementSchema;
    }
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
            <span className="flex items-center justify-between gap-3 text-[10px] font-mono font-bold uppercase tracking-widest">
                <span className={required ? "text-status-critical" : "text-txt-disabled"}>{label}</span>
                {error ? <span className="text-status-critical normal-case tracking-normal">{error}</span> : null}
            </span>
            {children}
        </label>
    );
}

export function CatalogsForm({
    tab,
    initialData,
    resourceOptions = [],
    isSubmitting = false,
    onSubmit,
    onDelete,
    onClear,
}: CatalogsFormProps) {
    const form = useForm<FieldValues>({
        resolver: zodResolver(getCatalogSchema(tab) as never),
        defaultValues: (initialData ?? getEmptyRecord(tab)) as FieldValues,
    });
    const errors = form.formState.errors as Record<string, { message?: string } | undefined>;

    useEffect(() => {
        form.reset((initialData ?? getEmptyRecord(tab)) as FieldValues);
    }, [form, initialData, tab]);

    const currentValues = useWatch({ control: form.control }) as CatalogRecord;
    const recordId = initialData?.id ?? null;
    const isEditMode = recordId != null;

    const handleClear = () => {
        form.reset(getEmptyRecord(tab) as FieldValues);
        onClear();
    };

    return (
        <form
            onSubmit={form.handleSubmit(async (values) => {
                await onSubmit(values as CatalogRecord);
            })}
            className="flex h-full flex-col"
        >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-default bg-bg-secondary/50">
                <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.15em]">
                    {isEditMode ? `ID: ${recordId}` : "Nuevo Registro"}
                </div>
                <div className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest">
                    {tab === "professions" ? "Catalogo de profesiones" : tab === "resources" ? "Catalogo de recursos" : "Catalogo de logros"}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="ID Sistema">
                        <input
                            readOnly
                            value={isEditMode ? String(recordId) : "AUTO"}
                            className="bg-bg-tertiary/30 border border-border-subtle px-3 py-2.5 font-mono text-xs text-txt-disabled outline-none cursor-not-allowed w-full"
                        />
                    </Field>

                    <Field label="Estado" required error={errors.state?.message}>
                        <select {...form.register("state")} className={fieldClassName}>
                            <option value="A">ACTIVO</option>
                            <option value="I">INACTIVO</option>
                        </select>
                    </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Codigo" required error={errors.code?.message}>
                        <input {...form.register("code")} className={fieldClassName} placeholder="COD-001" />
                    </Field>

                    <Field label="Nombre" required error={errors.name?.message}>
                        <input {...form.register("name")} className={fieldClassName} placeholder="Nombre del registro" />
                    </Field>
                </div>

                <Field label="Descripcion" error={errors.description?.message}>
                    <textarea {...form.register("description")} rows={3} className={`${fieldClassName} resize-none`} placeholder="Descripcion del registro" />
                </Field>

                {tab === "professions" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Recurso Base" error={errors.default_resource_id?.message}>
                            <Controller
                                control={form.control}
                                name="default_resource_id"
                                render={({ field }) => (
                                    <select
                                        className={fieldClassName}
                                        value={field.value ?? ""}
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

                        <Field label="Produccion por Defecto" error={errors.default_production_amount?.message}>
                            <Controller
                                control={form.control}
                                name="default_production_amount"
                                render={({ field }) => (
                                    <input
                                        type="number"
                                        min="1"
                                        className={fieldClassName}
                                        value={field.value ?? ""}
                                        onChange={(event) => field.onChange(event.target.value ? Number(event.target.value) : null)}
                                        placeholder="0"
                                    />
                                )}
                            />
                        </Field>
                    </div>
                ) : null}

                {tab === "resources" ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Unidad de Medida" required error={errors.unitOfMeasure?.message}>
                                <select {...form.register("unitOfMeasure")} className={fieldClassName}>
                                    <option value="">[ SELECCIONAR ]</option>
                                    {RESOURCE_UNITS.map((unit) => (
                                        <option key={unit} value={unit}>
                                            {unit}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Categoria" required error={errors.category?.message}>
                                <input list="resource-categories" {...form.register("category")} className={fieldClassName} placeholder="ALIMENTO" />
                                <datalist id="resource-categories">
                                    {RESOURCE_CATEGORIES.map((category) => (
                                        <option key={category} value={category} />
                                    ))}
                                </datalist>
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Consumible">
                                <Controller
                                    control={form.control}
                                    name="consumable"
                                    render={({ field }) => (
                                        <select
                                            className={fieldClassName}
                                            value={field.value ? "Y" : "N"}
                                            onChange={(event) => field.onChange(event.target.value === "Y")}
                                        >
                                            <option value="Y">SI</option>
                                            <option value="N">NO</option>
                                        </select>
                                    )}
                                />
                            </Field>

                            <Field label="Nivel de Estado">
                                <select {...form.register("status")} className={fieldClassName}>
                                    <option value="">SIN CLASIFICAR</option>
                                    <option value="O">OK</option>
                                    <option value="M">MODERADO</option>
                                    <option value="C">CRITICO</option>
                                </select>
                            </Field>
                        </div>
                    </>
                ) : null}

                {tab === "achievements" ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Categoria" error={errors.category?.message}>
                                <input list="achievement-categories" {...form.register("category")} className={fieldClassName} placeholder="EXPLORADOR" />
                                <datalist id="achievement-categories">
                                    {ACHIEVEMENT_CATEGORIES.map((category) => (
                                        <option key={category} value={category} />
                                    ))}
                                </datalist>
                            </Field>

                            <Field label="Puntos" required error={errors.points?.message}>
                                <Controller
                                    control={form.control}
                                    name="points"
                                    render={({ field }) => (
                                        <input
                                            type="number"
                                            min="0"
                                            className={fieldClassName}
                                            value={field.value ?? 0}
                                            onChange={(event) => field.onChange(Number(event.target.value))}
                                            placeholder="0"
                                        />
                                    )}
                                />
                            </Field>
                        </div>

                        <Field label="URL del Icono" error={errors.icon_url?.message}>
                            <input {...form.register("icon_url")} className={fieldClassName} placeholder="/icons/logro.svg" />
                        </Field>

                        <Field label="Condicion" required error={errors.condition_logic?.message}>
                            <textarea
                                {...form.register("condition_logic")}
                                rows={4}
                                className={`${fieldClassName} resize-none`}
                                placeholder='{"type":"resource_produced","resource_code":"AGUA","amount":100}'
                            />
                        </Field>
                    </>
                ) : null}

                {"created_at" in currentValues && currentValues.created_at ? (
                    <div className="px-3 py-2 bg-status-info/10 border border-status-info/20 text-[10px] font-mono text-status-info uppercase tracking-widest italic">
                        Creado en: {currentValues.created_at}
                    </div>
                ) : null}
            </div>

            <div className="flex flex-col gap-3 p-5 bg-bg-secondary border-t border-border-default">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-hover text-accent-fg font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(232,93,4,0.3)] disabled:opacity-50"
                >
                    <Save size={14} />
                    {isSubmitting ? "PROCESANDO..." : isEditMode ? "ACTUALIZAR" : "GUARDAR"}
                </button>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={handleClear}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3 border border-border-default hover:border-txt-disabled text-txt-secondary hover:text-txt-primary font-mono text-xs font-bold uppercase tracking-widest transition-all"
                    >
                        <RotateCcw size={12} />
                        LIMPIAR
                    </button>

                    <button
                        type="button"
                        disabled={isSubmitting || !isEditMode}
                        onClick={async () => onDelete(initialData ?? currentValues)}
                        className="w-full flex items-center justify-center gap-2 py-3 border border-status-critical/30 text-status-critical hover:bg-status-critical/10 font-mono text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                        <Trash2 size={12} />
                        ELIMINAR
                    </button>
                </div>
            </div>
        </form>
    );
}
