import { useState, type FormEvent } from "react";
import { AlertTriangle, Save, X } from "lucide-react";

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
    "w-full border border-[#3a3a3a] bg-[#111111] px-4 py-3 text-[12px] font-mono text-white outline-none transition-colors placeholder:text-[#6B7280] hover:border-[#E85D04]/60 focus:border-[#E85D04] disabled:cursor-not-allowed disabled:bg-[#242424] disabled:text-[#6B7280]";

const labelClass =
    "mb-1 block text-[10px] font-mono font-bold uppercase tracking-label text-[#6B7280]";

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
            setErrorMessage("The current user's camp could not be found.");
            return;
        }

        if (!code.trim()) {
            setErrorMessage("Code is required.");
            return;
        }

        if (!name.trim()) {
            setErrorMessage("Name is required.");
            return;
        }

        if (!departureDate) {
            setErrorMessage("Departure date is required.");
            return;
        }

        if (estimatedReturnDate && estimatedReturnDate < departureDate) {
            setErrorMessage(
                "Estimated return date cannot be earlier than departure date.",
            );
            return;
        }

        const payload: CreateExploration = {
            camp_id: campId,
            code: code.trim(),
            name: name.trim(),
            departure_date: departureDate,
            estimated_return_date: estimatedReturnDate || undefined,
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
                    ? "The exploration could not be updated."
                    : "The exploration could not be created.",
            );
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6">
            <div className="max-h-[88vh] w-full max-w-5xl overflow-y-auto border border-[#E85D04]/45 bg-[#1a1a1a] text-white shadow-[0_0_30px_rgba(0,0,0,0.65)]">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#3a3a3a] bg-[#242424] px-5 py-4">
                    <div>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-label text-[#E85D04]">
                            {isEditMode ? "Edit exploration" : "New exploration"}
                        </p>

                        <h3 className="mt-1 text-2xl font-mono font-black uppercase tracking-wide text-white">
                            {isEditMode ? "Update record" : "Register departure"}
                        </h3>

                        <p className="mt-1 text-[10px] font-mono uppercase tracking-label text-[#6B7280]">
                            Field operation / schedule / mission objective
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="border border-[#3a3a3a] bg-[#111111] p-2 text-[#6B7280] transition-colors hover:border-[#E85D04] hover:text-[#E85D04]"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5">
                    {errorMessage && (
                        <div className="mb-4 flex items-center gap-2 border border-[#E85D04] bg-[#E85D04]/10 px-4 py-3 font-mono text-xs uppercase tracking-label text-[#E85D04]">
                            <AlertTriangle size={15} />
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>Code</label>
                                <input
                                    className={inputClass}
                                    value={code}
                                    onChange={(event) => setCode(event.target.value)}
                                    placeholder="EXP-AUR-0001"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Name</label>
                                <input
                                    className={inputClass}
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Zone reconnaissance"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4">
                            <div>
                                <label className={labelClass}>Departure</label>
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
                                <label className={labelClass}>
                                    Estimated return
                                </label>
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
                                <label className={labelClass}>Risk</label>
                                <select
                                    className={inputClass}
                                    value={riskLevel}
                                    onChange={(event) =>
                                        setRiskLevel(
                                            event.target.value as "L" | "M" | "H",
                                        )
                                    }
                                >
                                    <option value="L">Low</option>
                                    <option value="M">Medium</option>
                                    <option value="H">High</option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Status</label>
                                <select
                                    className={inputClass}
                                    value={state}
                                    disabled={!isEditMode}
                                    onChange={(event) =>
                                        setState(
                                            event.target.value as
                                                | "P"
                                                | "A"
                                                | "F"
                                                | "C",
                                        )
                                    }
                                >
                                    <option value="P">Pending</option>
                                    <option value="A">Active</option>
                                    <option value="F">Finished</option>
                                    <option value="C">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Objective</label>
                            <textarea
                                className={`${inputClass} min-h-[90px] resize-none`}
                                value={objective}
                                onChange={(event) => setObjective(event.target.value)}
                                placeholder="Describe the exploration objective..."
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Notes</label>
                            <textarea
                                className={`${inputClass} min-h-[90px] resize-none`}
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                placeholder="Additional notes..."
                            />
                        </div>

                        <div className="sticky bottom-0 flex flex-col gap-3 border-t border-[#3a3a3a] bg-[#1a1a1a] pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-[10px] font-mono font-bold uppercase tracking-label text-[#6B7280]">
                                Status:{" "}
                                <span className="text-[#E85D04]">
                                    {isEditMode ? state : "P"}
                                </span>{" "}
                                | Duration:{" "}
                                <span className="text-[#E85D04]">
                                    {durationDays}{" "}
                                    {durationDays === 1 ? "day" : "days"}
                                </span>
                            </p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="border border-[#3a3a3a] px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-label text-[#C0C0C0] transition-colors hover:border-white hover:text-white"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center justify-center gap-2 border border-[#E85D04] bg-[#E85D04] px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-label text-[#111111] transition-colors hover:bg-[#FF6A10] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save size={14} />
                                    {saving
                                        ? "Saving..."
                                        : isEditMode
                                          ? "Update"
                                          : "Save"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}