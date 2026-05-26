import { BadgeAlert, Pencil, ShieldCheck, Boxes, Play, Flag, Ban, } from "lucide-react";

import type { ExplorationRow } from "./explorationHelpers";
import {
    getCampLabel,
    getDuration,
    getRiskLabel,
    getStateLabel,
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

const detailCardClass = "bg-white/5 px-4 py-3";

const detailLabelClass =
    "text-[10px] uppercase tracking-[0.25em] text-[#9CA3AF]";

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
    const canCancel = selectedExploration?.state === "P" || selectedExploration?.state === "A";

    return (
        <aside className="w-full xl:max-w-[360px] xl:self-start">
            <div className="flex h-[calc(100vh-270px)] min-h-[460px] flex-col overflow-hidden rounded-xl bg-[#232323] text-white shadow-[0_0_18px_rgba(0,0,0,0.35)]">
                <div className="shrink-0 border-b border-white/10 p-5">
                    

                    <div className="flex items-start gap-3">
                        <BadgeAlert className="mt-1 shrink-0 text-[#FF6600]" />

                        <div className="min-w-0 flex-1">
                            <p className={detailLabelClass}>Exploration detail</p>
                            <h3 className="mt-1 break-words text-2xl leading-tight">
                                {selectedExploration?.name ?? "----"}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                    <div className="space-y-4 text-sm">

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <button
                                type="button"
                                disabled={!hasSelectedExploration}
                                onClick={() => {
                                    if (selectedExploration) {
                                        onEditExploration(selectedExploration);
                                    }
                                }}
                                className="flex items-center justify-center gap-2 border border-[#FF6600] bg-[#FF6600] px-3 py-3 text-xs uppercase tracking-[0.18em] text-black transition-colors hover:bg-transparent hover:text-[#FF6600] disabled:cursor-not-allowed disabled:border-[#555] disabled:bg-[#555] disabled:text-[#999]"
                            >
                                <Pencil size={14} />
                                Editar
                            </button>

                            <button
                                type="button"
                                disabled={!hasSelectedExploration}
                                onClick={onManagePeople}
                                className="flex items-center justify-center gap-2 border border-[#FF6600] px-3 py-3 text-xs uppercase tracking-[0.18em] text-[#FF6600] transition-colors hover:bg-[#FF6600] hover:text-black disabled:cursor-not-allowed disabled:border-[#555] disabled:text-[#777]"
                            >
                                Personas
                            </button>

                            <button
                                type="button"
                                disabled={!hasSelectedExploration}
                                onClick={onManageResources}
                                className="flex items-center justify-center gap-2 border border-[#FF6600] px-3 py-3 text-xs uppercase tracking-[0.18em] text-[#FF6600] transition-colors hover:bg-[#FF6600] hover:text-black disabled:cursor-not-allowed disabled:border-[#555] disabled:text-[#777]"
                            >
                                <Boxes size={14} />
                                Recursos
                            </button>
                        </div>

                        {(canStart || canFinish || canCancel) && (
                            <div className="grid grid-cols-1 gap-2 border-t border-white/10 pt-4 sm:grid-cols-2">
                                {canStart && (
                                    <button
                                        type="button"
                                        disabled={!selectedExploration}
                                        onClick={() => {
                                            if (selectedExploration) {
                                                onChangeExplorationState(selectedExploration, "A");
                                            }
                                        }}
                                        className="flex items-center justify-center gap-2 border border-green-500 bg-green-500 px-3 py-3 text-xs uppercase tracking-[0.18em] text-black transition-colors hover:bg-transparent hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Play size={14} />
                                        Iniciar
                                    </button>
                                )}

                                {canFinish && (
                                    <button
                                        type="button"
                                        disabled={!selectedExploration}
                                        onClick={() => {
                                            if (selectedExploration) {
                                                onChangeExplorationState(selectedExploration, "F");
                                            }
                                        }}
                                        className="flex items-center justify-center gap-2 border border-blue-500 bg-blue-500 px-3 py-3 text-xs uppercase tracking-[0.18em] text-black transition-colors hover:bg-transparent hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Flag size={14} />
                                        Finalizar
                                    </button>
                                )}

                                {canCancel && (
                                    <button
                                        type="button"
                                        disabled={!selectedExploration}
                                        onClick={() => {
                                            if (selectedExploration) {
                                                onChangeExplorationState(selectedExploration, "C");
                                            }
                                        }}
                                        className="flex items-center justify-center gap-2 border border-red-500 px-3 py-3 text-xs uppercase tracking-[0.18em] text-red-400 transition-colors hover:bg-red-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Ban size={14} />
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        )}

                        <div className={detailCardClass}>
                            <p className={detailLabelClass}>Objective</p>
                            <p className="mt-2 whitespace-pre-wrap break-words text-white">
                                {selectedExploration?.objective || "Sin objetivo"}
                            </p>
                        </div>

                        <div className={detailCardClass}>
                            <p className={detailLabelClass}>Notes</p>
                            <p className="mt-2 whitespace-pre-wrap break-words text-white">
                                {selectedExploration?.notes || "Sin notas"}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className={detailCardClass}>
                                <p className={detailLabelClass}>Risk</p>
                                <p className="mt-2 text-lg">
                                    {getRiskLabel(selectedExploration?.risk_level)}
                                </p>
                            </div>

                            <div className={detailCardClass}>
                                <p className={detailLabelClass}>State</p>
                                <p className="mt-2 text-lg">
                                    {getStateLabel(selectedExploration?.state)}
                                </p>
                            </div>
                        </div>

                        <div className={detailCardClass}>
                            <p className={detailLabelClass}>Departure / Return</p>
                            <p className="mt-2">
                                {selectedExploration?.departure_date || "--"}
                            </p>
                            <p className="text-[#bdbdbd]">
                                {selectedExploration?.estimated_return_date || "--"}
                            </p>
                        </div>

                        <div className={detailCardClass}>
                            <p className={detailLabelClass}>Duration</p>
                            <p className="mt-2">
                                {getDuration(selectedExploration?.duration_days)}
                            </p>
                        </div>

                        <div className={detailCardClass}>
                            <p className={detailLabelClass}>Camp</p>
                            <p className="mt-2">
                                {getCampLabel(selectedExploration?.camp_id)}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-[11px] uppercase tracking-[0.25em] text-[#9CA3AF]">
                            <ShieldCheck className="h-4 w-4 shrink-0 text-green-400" />
                            <span>Exploration record available</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}