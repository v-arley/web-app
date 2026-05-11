import { BadgeAlert, ShieldCheck } from "lucide-react";

import type { ExplorationRow } from "./explorationHelpers";
import {
    getCampLabel,
    getDuration,
    getRiskLabel,
    getStateLabel,
} from "./explorationHelpers";

type Props = {
    selectedExploration: ExplorationRow | null;
};

const detailCardClass = "bg-white/5 px-4 py-3";

const detailLabelClass =
    "text-[10px] uppercase tracking-[0.25em] text-[#9CA3AF]";

export default function ExplorationDetailPanel({
    selectedExploration,
}: Props) {
    return (
        <aside className="w-full xl:max-w-[360px]">
            <div className="rounded-xl bg-[#232323] p-6 text-white shadow-[0_0_18px_rgba(0,0,0,0.35)]">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <BadgeAlert className="text-[#FF6600]" />

                    <div>
                        <p className={detailLabelClass}>Exploration detail</p>
                        <h3 className="mt-1 text-2xl">
                            {selectedExploration?.name ?? "----"}
                        </h3>
                    </div>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                    <div className={detailCardClass}>
                        <p className={detailLabelClass}>Objective</p>
                        <p className="mt-2 text-white">
                            {selectedExploration?.objective || "Sin objetivo"}
                        </p>
                    </div>

                    <div className={detailCardClass}>
                        <p className={detailLabelClass}>Notes</p>
                        <p className="mt-2 text-white">
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
                </div>

                <div className="mt-6 flex gap-3">
                    <button className="flex-1 border border-[#FF6600] bg-[#FF6600] px-4 py-3 text-sm uppercase tracking-[0.2em] text-black transition-colors hover:bg-transparent hover:text-[#FF6600]">
                        Editar
                    </button>

                    <button className="flex-1 border border-[#FF6600] px-4 py-3 text-sm uppercase tracking-[0.2em] text-[#FF6600] transition-colors hover:bg-[#FF6600] hover:text-black">
                        Ver más
                    </button>
                </div>

                <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-[11px] uppercase tracking-[0.25em] text-[#9CA3AF]">
                    <ShieldCheck className="h-4 w-4 text-green-400" />
                    Exploration record available
                </div>
            </div>
        </aside>
    );
}