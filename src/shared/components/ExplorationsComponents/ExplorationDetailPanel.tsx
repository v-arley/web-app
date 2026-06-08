import {
    BadgeAlert,
    Ban,
    Boxes,
    Flag,
    Pencil,
    Play,
    ShieldCheck,
    UsersRound,
} from "lucide-react";

import type { ExplorationRow } from "./explorationHelpers";
import {
    getCampLabel,
    getDuration,
} from "./explorationHelpers";

type Props = {
    selectedExploration: ExplorationRow | null;
    onEditExploration: (exploration: ExplorationRow) => void;
    onManagePeople: () => void;
    onManageResources: () => void;
    onChangeExplorationState: (
        exploration: ExplorationRow,
        newState: "A" | "F" | "C",
    ) => void;
};

const detailCardClass =
    "border border-[#3a3a3a] bg-[#111111] p-4 transition-colors hover:border-[#E85D04]/50";

const detailLabelClass =
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

export default function ExplorationDetailPanel({
    selectedExploration,
    onEditExploration,
    onManagePeople,
    onManageResources,
    onChangeExplorationState,
}: Props) {
    const hasSelectedExploration = Boolean(selectedExploration);
    const canStart = selectedExploration?.state === "P";
    const canFinish = selectedExploration?.state === "A";
    const canCancel =
        selectedExploration?.state === "P" ||
        selectedExploration?.state === "A";
    const canEdit = selectedExploration?.state === "P";

    return (
        <aside className="w-full xl:max-w-[360px] xl:self-start">
            <section className="flex h-[calc(100vh-270px)] min-h-[460px] flex-col overflow-hidden border border-[#3a3a3a] bg-[#1a1a1a] text-white shadow-[0_0_18px_rgba(0,0,0,0.35)]">
                <div className="shrink-0 border-b border-[#3a3a3a] bg-[#242424] p-5">
                    <div className="flex items-start gap-3">
                        <div className="border border-[#E85D04]/60 bg-[#E85D04]/10 p-2 text-[#E85D04]">
                            <BadgeAlert size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-mono font-bold uppercase tracking-label text-[#E85D04]">
                                Exploration detail
                            </p>

                            <h3 className="mt-2 break-words text-2xl font-mono font-black uppercase leading-tight tracking-wide text-white">
                                {selectedExploration?.name ?? "No exploration"}
                            </h3>

                            <p className="mt-1 text-[10px] font-mono uppercase tracking-label text-[#6B7280]">
                                Field record / assignment / status control
                            </p>
                        </div>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                    <div className="space-y-4 text-sm">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <button
                                type="button"
                                disabled={!hasSelectedExploration || !canEdit}
                                onClick={() => {
                                    if (selectedExploration && canEdit) {
                                        onEditExploration(selectedExploration);
                                    }
                                }}
                                className="flex items-center justify-center gap-2 border border-[#E85D04] bg-[#E85D04] px-3 py-3 text-[10px] font-mono font-bold uppercase tracking-label text-[#111111] transition-colors hover:bg-[#FF6A10] disabled:cursor-not-allowed disabled:border-[#3a3a3a] disabled:bg-[#2a2a2a] disabled:text-[#6B7280]"
                            >
                                <Pencil size={14} />
                                Edit
                            </button>

                            <button
                                type="button"
                                disabled={!hasSelectedExploration}
                                onClick={onManagePeople}
                                className="flex items-center justify-center gap-2 border border-[#E85D04]/70 px-3 py-3 text-[10px] font-mono font-bold uppercase tracking-label text-[#E85D04] transition-colors hover:bg-[#E85D04] hover:text-[#111111] disabled:cursor-not-allowed disabled:border-[#3a3a3a] disabled:text-[#6B7280]"
                            >
                                <UsersRound size={14} />
                                People
                            </button>

                            <button
                                type="button"
                                disabled={!hasSelectedExploration}
                                onClick={onManageResources}
                                className="flex items-center justify-center gap-2 border border-[#E85D04]/70 px-3 py-3 text-[10px] font-mono font-bold uppercase tracking-label text-[#E85D04] transition-colors hover:bg-[#E85D04] hover:text-[#111111] disabled:cursor-not-allowed disabled:border-[#3a3a3a] disabled:text-[#6B7280]"
                            >
                                <Boxes size={14} />
                                Resources
                            </button>
                        </div>

                        {(canStart || canFinish || canCancel) && (
                            <div className="grid grid-cols-1 gap-2 border-t border-[#3a3a3a] pt-4 sm:grid-cols-2">
                                {canStart && (
                                    <button
                                        type="button"
                                        disabled={!selectedExploration}
                                        onClick={() => {
                                            if (selectedExploration) {
                                                onChangeExplorationState(
                                                    selectedExploration,
                                                    "A",
                                                );
                                            }
                                        }}
                                        className="flex items-center justify-center gap-2 border border-[#22C55E] bg-[#22C55E] px-3 py-3 text-[10px] font-mono font-bold uppercase tracking-label text-[#111111] transition-colors hover:bg-transparent hover:text-[#22C55E] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Play size={14} />
                                        Start
                                    </button>
                                )}

                                {canFinish && (
                                    <button
                                        type="button"
                                        disabled={!selectedExploration}
                                        onClick={() => {
                                            if (selectedExploration) {
                                                onChangeExplorationState(
                                                    selectedExploration,
                                                    "F",
                                                );
                                            }
                                        }}
                                        className="flex items-center justify-center gap-2 border border-[#38BDF8] bg-[#38BDF8] px-3 py-3 text-[10px] font-mono font-bold uppercase tracking-label text-[#111111] transition-colors hover:bg-transparent hover:text-[#38BDF8] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Flag size={14} />
                                        Finish
                                    </button>
                                )}

                                {canCancel && (
                                    <button
                                        type="button"
                                        disabled={!selectedExploration}
                                        onClick={() => {
                                            if (selectedExploration) {
                                                onChangeExplorationState(
                                                    selectedExploration,
                                                    "C",
                                                );
                                            }
                                        }}
                                        className="flex items-center justify-center gap-2 border border-red-500 px-3 py-3 text-[10px] font-mono font-bold uppercase tracking-label text-red-400 transition-colors hover:bg-red-500 hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Ban size={14} />
                                        Cancel
                                    </button>
                                )}
                            </div>
                        )}

                        <div className={detailCardClass}>
                            <p className={detailLabelClass}>Objective</p>
                            <p className="mt-2 whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-[#C0C0C0]">
                                {selectedExploration?.objective ||
                                    "No objective registered."}
                            </p>
                        </div>

                        <div className={detailCardClass}>
                            <p className={detailLabelClass}>Notes</p>
                            <p className="mt-2 whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-[#C0C0C0]">
                                {selectedExploration?.notes ||
                                    "No notes registered."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className={detailCardClass}>
                                <p className={detailLabelClass}>Risk</p>
                                <p className="mt-2 font-mono text-lg font-bold text-[#FACC15]">
                                    {getEnglishRiskLabel(
                                        selectedExploration?.risk_level,
                                    )}
                                </p>
                            </div>

                            <div className={detailCardClass}>
                                <p className={detailLabelClass}>Status</p>
                                <p className="mt-2 font-mono text-lg font-bold text-[#38BDF8]">
                                    {getEnglishStateLabel(
                                        selectedExploration?.state,
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className={detailCardClass}>
                            <p className={detailLabelClass}>Departure / Return</p>
                            <p className="mt-2 font-mono text-[13px] text-white">
                                {selectedExploration?.departure_date || "N/A"}
                            </p>
                            <p className="font-mono text-[13px] text-[#9CA3AF]">
                                {selectedExploration?.estimated_return_date ||
                                    "N/A"}
                            </p>
                        </div>

                        <div className={detailCardClass}>
                            <p className={detailLabelClass}>Duration</p>
                            <p className="mt-2 font-mono text-[13px] text-white">
                                {getDuration(selectedExploration?.duration_days)}
                            </p>
                        </div>

                        <div className={detailCardClass}>
                            <p className={detailLabelClass}>Camp</p>
                            <p className="mt-2 font-mono text-[13px] text-white">
                                {getCampLabel(selectedExploration?.camp_id)}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 border-t border-[#3a3a3a] pt-4 text-[10px] font-mono font-bold uppercase tracking-label text-[#6B7280]">
                            <ShieldCheck className="h-4 w-4 shrink-0 text-[#22C55E]" />
                            <span>Exploration record available</span>
                        </div>
                    </div>
                </div>
            </section>
        </aside>
    );
}