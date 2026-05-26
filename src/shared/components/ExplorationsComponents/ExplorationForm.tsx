import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

import type { CreateExploration } from "../../../models/Exploration";
import type { ExplorationRow } from "./explorationHelpers";

type FormMode = "create" | "edit";

type Props = {
    mode?: FormMode;
    campId?: number;
    saving: boolean;
    initialData?: ExplorationRow | null;
    onCancel: () => void;
    onSubmit: (payload: CreateExploration) => Promise<boolean>;
};

const inputClass =
    "w-full rounded-lg border border-[#444] bg-[#111] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#777] focus:border-[#FF6600]";

const labelClass =
    "text-[10px] uppercase tracking-[0.25em] text-[#9CA3AF]";

function buildDate(value: string) {
    return new Date(`${value}T00:00:00`);
}

function calculateDuration(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
        return 0;
    }

    const start = buildDate(startDate).getTime();
    const end = buildDate(endDate).getTime();

    if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
        return 0;
    }

    const diffMs = end - start;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return diffDays || 1;
}

export default function ExplorationForm({
    mode = "create",
    campId,
    saving,
    initialData,
    onCancel,
    onSubmit,
}: Props) {
    const isEditMode = mode === "edit";

    const [code, setCode] = useState(initialData?.code ?? "");
    const [name, setName] = useState(initialData?.name ?? "");
    const [departureDate, setDepartureDate] = useState(
        initialData?.departure_date ?? "",
    );
    const [estimatedReturnDate, setEstimatedReturnDate] = useState(
        initialData?.estimated_return_date ?? "",
    );
    const [riskLevel, setRiskLevel] = useState<"L" | "M" | "H">(
        initialData?.risk_level ?? "M",
    );
    const [state, setState] = useState<"P" | "A" | "F" | "C">(
        initialData?.state ?? "P",
    );
    const [objective, setObjective] = useState(initialData?.objective ?? "");
    const [notes, setNotes] = useState(initialData?.notes ?? "");
    const [errorMessage, setErrorMessage] = useState("");

    const durationDays = calculateDuration(departureDate, estimatedReturnDate);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");

        if (!campId) {
            setErrorMessage("No se encontró el campamento del usuario actual.");
            return;
        }

        if (!code.trim()) {
            setErrorMessage("El código es obligatorio.");
            return;
        }

        if (!name.trim()) {
            setErrorMessage("El nombre es obligatorio.");
            return;
        }

        if (!departureDate) {
            setErrorMessage("La fecha de salida es obligatoria.");
            return;
        }

        if (estimatedReturnDate && estimatedReturnDate < departureDate) {
            setErrorMessage(
                "La fecha de retorno no puede ser menor que la fecha de salida.",
            );
            return;
        }

        const payload: CreateExploration = {
            camp_id: campId,
            code: code.trim(),
            name: name.trim(),
            departure_date: buildDate(departureDate),
            estimated_return_date: estimatedReturnDate
                ? buildDate(estimatedReturnDate)
                : undefined,
            duration_days: durationDays,
            state: isEditMode ? state : "P",
            objective: objective.trim(),
            notes: notes.trim(),
            risk_level: riskLevel,
        };

        const saved = await onSubmit(payload);

        if (!saved) {
            setErrorMessage(
                isEditMode
                    ? "No se pudo actualizar la exploración."
                    : "No se pudo crear la exploración.",
            );
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6">
            <div className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-[#FF6600]/40 bg-[#232323] p-5 text-white shadow-[0_0_30px_rgba(0,0,0,0.65)]">
                <div className="sticky top-0 z-10 mb-5 flex items-center justify-between border-b border-white/10 bg-[#232323] pb-4">
                    <div>
                        <p className={labelClass}>
                            {isEditMode ? "Editar exploración" : "Nueva exploración"}
                        </p>
                        <h3 className="mt-1 text-2xl">
                            {isEditMode ? "Actualizar datos" : "Registrar salida"}
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-white/10 p-2 text-[#9CA3AF] transition-colors hover:border-[#FF6600] hover:text-[#FF6600]"
                    >
                        <X size={18} />
                    </button>
                </div>

                {errorMessage && (
                    <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>Código</label>
                            <input
                                className={inputClass}
                                value={code}
                                onChange={(event) => setCode(event.target.value)}
                                placeholder="EXP-AUR-0001"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Nombre</label>
                            <input
                                className={inputClass}
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Reconocimiento de zona"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <label className={labelClass}>Salida</label>
                            <input
                                type="date"
                                className={inputClass}
                                value={departureDate}
                                onChange={(event) =>
                                    setDepartureDate(event.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Retorno estimado</label>
                            <input
                                type="date"
                                className={inputClass}
                                value={estimatedReturnDate}
                                onChange={(event) =>
                                    setEstimatedReturnDate(event.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Riesgo</label>
                            <select
                                className={inputClass}
                                value={riskLevel}
                                onChange={(event) =>
                                    setRiskLevel(event.target.value as "L" | "M" | "H")
                                }
                            >
                                <option value="L">Bajo</option>
                                <option value="M">Medio</option>
                                <option value="H">Alto</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Estado</label>
                            <select
                                className={inputClass}
                                value={state}
                                disabled={!isEditMode}
                                onChange={(event) =>
                                    setState(event.target.value as "P" | "A" | "F" | "C")
                                }
                            >
                                <option value="P">Pendiente</option>
                                <option value="A">Activa</option>
                                <option value="F">Finalizada</option>
                                <option value="C">Cancelada</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Objetivo</label>
                        <textarea
                            className={`${inputClass} min-h-[90px] resize-none`}
                            value={objective}
                            onChange={(event) => setObjective(event.target.value)}
                            placeholder="Describe el objetivo de la exploración..."
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Notas</label>
                        <textarea
                            className={`${inputClass} min-h-[90px] resize-none`}
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            placeholder="Notas adicionales..."
                        />
                    </div>

                    <div className="sticky bottom-0 flex flex-col gap-3 border-t border-white/10 bg-[#232323] pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-[#9CA3AF]">
                            Estado: {isEditMode ? state : "P"} | Duración:{" "}
                            {durationDays} día{durationDays === 1 ? "" : "s"}
                        </p>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="border border-[#555] px-5 py-3 text-sm uppercase tracking-[0.2em] text-[#ccc] transition-colors hover:border-white hover:text-white"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="border border-[#FF6600] bg-[#FF6600] px-5 py-3 text-sm uppercase tracking-[0.2em] text-black transition-colors hover:bg-transparent hover:text-[#FF6600] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving
                                    ? "Guardando..."
                                    : isEditMode
                                      ? "Actualizar"
                                      : "Guardar"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}