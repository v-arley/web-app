import type { ExplorationRow } from "./explorationHelpers";
import { Boxes, ChevronLeft, ChevronRight, UsersRound } from "lucide-react";
import {
    getCampLabel,
    getDuration,
    getRiskBadge,
    getStateBadge,  
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
    "text-[10px] font-mono font-bold uppercase tracking-label text-[#6B7280]";

function getEnglishStateLabel(state?: ExplorationRow["state"]) {
    if (state === "P") return "Pending";
    if (state === "A") return "Active";
    if (state === "F") return "Finished";
    if (state === "C") return "Cancelled";
    return "Unknown";
}

function getEnglishRiskLabel(risk?: ExplorationRow["risk_level"]) {
    if (risk === "L") return "Low";
    if (risk === "M") return "Medium";
    if (risk === "H") return "High";
    return "Unknown";
}

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
        <section className="flex h-[calc(100vh-355px)] min-h-[430px] flex-col overflow-hidden border border-[#3a3a3a] bg-[#1a1a1a] shadow-[0_0_18px_rgba(0,0,0,0.35)]">
            <div className="flex shrink-0 flex-col gap-3 border-b border-[#3a3a3a] bg-[#242424] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-label text-[#E85D04]">
                        Registered explorations
                    </p>
                    <p className="mt-1 text-[10px] font-mono uppercase tracking-label text-[#6B7280]">
                        Field records / crew count / target resources
                    </p>
                </div>

                <p className="border border-[#3a3a3a] bg-[#111111] px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-label text-[#C0C0C0]">
                    Found:{" "}
                    <span className="text-[#E85D04]">
                        {total.toString().padStart(4, "0")}
                    </span>
                </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {explorations.length === 0 ? (
                    <div className="flex h-full items-center justify-center border border-[#3a3a3a] bg-[#111111] p-6 text-center text-xs font-mono uppercase tracking-label text-[#E85D04]">
                        No explorations found
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 pb-2">
                        {explorations.map((exploration) => {
                            const isSelected =
                                selectedExploration?.id === exploration.id;

                            return (
                                <button
                                    key={exploration.id}
                                    type="button"
                                    onClick={() => onSelectExploration(exploration)}
                                    className={`w-full border p-4 text-left font-mono transition-colors ${
                                        isSelected
                                            ? "border-[#E85D04] bg-[#E85D04]/10 text-white shadow-[0_0_16px_rgba(232,93,4,0.16)]"
                                            : "border-[#3a3a3a] bg-[#111111] text-[#C0C0C0] hover:border-[#E85D04]/70 hover:bg-[#202020]"
                                    }`}
                                >
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span
                                                    className={`border px-2 py-0.5 text-[10px] font-bold uppercase tracking-label ${
                                                        isSelected
                                                            ? "border-[#E85D04]/60 text-[#E85D04]"
                                                            : "border-[#3a3a3a] text-[#6B7280]"
                                                    }`}
                                                >
                                                    ID #{exploration.id}
                                                </span>

                                                <span className="break-words text-[12px] font-bold uppercase tracking-label text-[#E85D04]">
                                                    {exploration.code}
                                                </span>
                                            </div>

                                            <h3 className="mt-2 break-words text-base font-bold uppercase tracking-wide text-white">
                                                {exploration.name}
                                            </h3>

                                            <p className="mt-2 max-w-2xl break-words text-xs leading-relaxed text-[#9CA3AF]">
                                                {exploration.objective || "No objective registered."}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 lg:justify-end">
                                            <span
                                                className={`inline-flex items-center gap-1 border px-3 py-1 text-[10px] font-bold uppercase tracking-label ${
                                                    isSelected
                                                        ? "border-[#38BDF8]/50 bg-[#38BDF8]/10 text-[#38BDF8]"
                                                        : "border-[#3a3a3a] bg-[#1a1a1a] text-[#C0C0C0]"
                                                }`}
                                            >
                                                <UsersRound size={13} />
                                                {exploration.people_count ?? 0}
                                            </span>

                                            <span
                                                className={`inline-flex items-center gap-1 border px-3 py-1 text-[10px] font-bold uppercase tracking-label ${
                                                    isSelected
                                                        ? "border-[#FACC15]/50 bg-[#FACC15]/10 text-[#FACC15]"
                                                        : "border-[#3a3a3a] bg-[#1a1a1a] text-[#C0C0C0]"
                                                }`}
                                            >
                                                <Boxes size={13} />
                                                {exploration.resource_count ?? 0}
                                            </span>

                                            <span
                                                className={`inline-flex border px-3 py-1 text-[10px] font-bold uppercase tracking-label ${getRiskBadge(
                                                    exploration.risk_level,
                                                )}`}
                                            >
                                                {getEnglishRiskLabel(exploration.risk_level)}
                                            </span>

                                            <span
                                                className={`inline-flex border px-3 py-1 text-[10px] font-bold uppercase tracking-label ${getStateBadge(
                                                    exploration.state,
                                                )}`}
                                            >
                                                {getEnglishStateLabel(exploration.state)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-3 border-t border-[#3a3a3a] pt-4 text-[12px] sm:grid-cols-2 lg:grid-cols-5">
                                        <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-3">
                                            <p className={infoLabelClass}>Departure</p>
                                            <p className="mt-1 text-white">
                                                {exploration.departure_date || "N/A"}
                                            </p>
                                        </div>

                                        <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-3">
                                            <p className={infoLabelClass}>Return</p>
                                            <p className="mt-1 text-white">
                                                {exploration.estimated_return_date ||
                                                    "N/A"}
                                            </p>
                                        </div>

                                        <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-3">
                                            <p className={infoLabelClass}>Duration</p>
                                            <p className="mt-1 text-white">
                                                {getDuration(
                                                    exploration.duration_days,
                                                )}
                                            </p>
                                        </div>

                                        <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-3">
                                            <p className={infoLabelClass}>Status</p>
                                            <p className="mt-1 text-white">
                                                {getEnglishStateLabel(exploration.state)}
                                            </p>
                                        </div>

                                        <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-3">
                                            <p className={infoLabelClass}>Camp</p>
                                            <p className="mt-1 text-white">
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

            <div className="flex shrink-0 flex-col gap-3 border-t border-[#3a3a3a] bg-[#111111] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[10px] font-mono uppercase tracking-label text-[#6B7280]">
                    Page{" "}
                    <span className="text-[#E85D04]">{currentPage}</span> of{" "}
                    <span className="text-[#E85D04]">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={!canGoPrevious}
                        className="flex h-9 items-center gap-2 border border-[#3a3a3a] px-3 text-[10px] font-mono uppercase tracking-label text-white transition-colors hover:border-[#E85D04] hover:text-[#E85D04] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#3a3a3a] disabled:hover:text-white"
                    >
                        <ChevronLeft size={14} />
                        Previous
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={!canGoNext}
                        className="flex h-9 items-center gap-2 border border-[#3a3a3a] px-3 text-[10px] font-mono uppercase tracking-label text-white transition-colors hover:border-[#E85D04] hover:text-[#E85D04] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#3a3a3a] disabled:hover:text-white"
                    >
                        Next
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </section>
    );
}