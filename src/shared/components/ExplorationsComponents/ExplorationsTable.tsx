import type { ExplorationRow } from "./explorationHelpers";
import { Boxes, ChevronLeft, ChevronRight, UsersRound } from "lucide-react";
import {
    getCampLabel,
    getDuration,
    getRiskBadge,
    getRiskLabel,
    getStateBadge,
    getStateLabel,
} from "./explorationHelpers";

type Props = {
    explorations: ExplorationRow[];
    selectedExploration: ExplorationRow | null;
    onSelectExploration: (exploration: ExplorationRow) => void;
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    onPageChange?: (page: number) => void;
};

const infoLabelClass =
    "text-[10px] uppercase tracking-[0.22em] text-[#7c8794]";

export default function ExplorationsTable({
    explorations,
    selectedExploration,
    onSelectExploration,
    currentPage = 1,
    totalPages = 1,
    totalItems,
    onPageChange,
}: Props) {
    const total = totalItems ?? explorations.length;
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const handlePrevious = () => {
        if (!canGoPrevious || !onPageChange) return;
        onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (!canGoNext || !onPageChange) return;
        onPageChange(currentPage + 1);
    };

    return (
        <div className="flex h-[calc(100vh-330px)] min-h-[430px] flex-col rounded-xl bg-[#cecece] p-4 shadow-[0_0_18px_rgba(0,0,0,0.35),inset_0_0_14px_rgba(115,115,115,0.33)] sm:p-5">
            <div className="mb-4 flex shrink-0 items-center justify-between border-b border-[#9ca3af] px-2 pb-3">
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#64748b]">
                    Exploraciones registradas
                </p>

                <p className="text-[11px] uppercase tracking-[0.25em] text-[#64748b]">
                    Found: {total.toString().padStart(4, "0")}
                </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                {explorations.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center text-sm uppercase tracking-[0.25em] text-[#f05a28]">
                        No se encontraron exploraciones
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 pb-4">
                        {explorations.map((exploration) => {
                            const isSelected =
                                selectedExploration?.id === exploration.id;

                            return (
                                <button
                                    key={exploration.id}
                                    type="button"
                                    onClick={() => onSelectExploration(exploration)}
                                    className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                                        isSelected
                                            ? "border-[#FF6600] bg-[#1f1f1f] text-white shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
                                            : "border-[#c7c7c7] bg-[#f7f7f7] text-[#222] hover:-translate-y-[1px] hover:border-[#FF6600]"
                                    }`}
                                >
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="text-xs text-[#8b8b8b]">
                                                    #{exploration.id}
                                                </span>

                                                <span className="break-words text-sm font-bold">
                                                    {exploration.code}
                                                </span>
                                            </div>

                                            <h3 className="mt-2 break-words text-base font-bold">
                                                {exploration.name}
                                            </h3>

                                            <p
                                                className={`mt-2 max-w-2xl break-words text-xs leading-relaxed ${
                                                    isSelected
                                                        ? "text-[#bdbdbd]"
                                                        : "text-[#707070]"
                                                }`}
                                            >
                                                {exploration.objective || "Sin objetivo"}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 lg:justify-end">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${
                                                    isSelected
                                                        ? "bg-white/10 text-white"
                                                        : "bg-gray-500/15 text-gray-700"
                                                }`}
                                            >
                                                <UsersRound size={13} />
                                                {exploration.people_count ?? 0}
                                            </span>

                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${
                                                    isSelected
                                                        ? "bg-white/10 text-white"
                                                        : "bg-gray-500/15 text-gray-700"
                                                }`}
                                            >
                                                <Boxes size={13} />
                                                {exploration.resource_count ?? 0}
                                            </span>

                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${getRiskBadge(
                                                    exploration.risk_level,
                                                )}`}
                                            >
                                                {getRiskLabel(exploration.risk_level)}
                                            </span>

                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${getStateBadge(
                                                    exploration.state,
                                                )}`}
                                            >
                                                {getStateLabel(exploration.state)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-3 border-t border-black/10 pt-4 text-sm sm:grid-cols-2 lg:grid-cols-5">
                                        <div>
                                            <p className={infoLabelClass}>Salida</p>
                                            <p className="mt-1">
                                                {exploration.departure_date || "N/D"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className={infoLabelClass}>Retorno</p>
                                            <p className="mt-1">
                                                {exploration.estimated_return_date ||
                                                    "N/D"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className={infoLabelClass}>Duración</p>
                                            <p className="mt-1">
                                                {getDuration(
                                                    exploration.duration_days,
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className={infoLabelClass}>Estado</p>
                                            <p className="mt-1">
                                                {getStateLabel(exploration.state)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className={infoLabelClass}>Camp</p>
                                            <p className="mt-1">
                                                {getCampLabel(exploration.camp_id)}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="mt-4 flex shrink-0 flex-col gap-3 border-t border-[#9ca3af] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#64748b]">
                    Página {currentPage} de {totalPages}
                </p>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={!canGoPrevious}
                        className="flex h-9 items-center gap-2 rounded-md border border-[#888] px-3 text-[11px] uppercase tracking-[0.18em] text-[#333] transition-colors hover:border-[#FF6600] hover:text-[#FF6600] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft size={14} />
                        Anterior
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={!canGoNext}
                        className="flex h-9 items-center gap-2 rounded-md border border-[#888] px-3 text-[11px] uppercase tracking-[0.18em] text-[#333] transition-colors hover:border-[#FF6600] hover:text-[#FF6600] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Siguiente
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}