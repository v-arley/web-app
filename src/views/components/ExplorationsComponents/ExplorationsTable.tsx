import type { ExplorationRow } from "./explorationHelpers";
import { Boxes, UsersRound } from "lucide-react";
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
};

const infoLabelClass =
    "text-[10px] uppercase tracking-[0.22em] text-[#7c8794]";

export default function ExplorationsTable({
    explorations,
    selectedExploration,
    onSelectExploration,
}: Props) {
    return (
        <div className="rounded-xl bg-[#cecece] p-4 shadow-[0_0_18px_rgba(0,0,0,0.35),inset_0_0_14px_rgba(115,115,115,0.33)] sm:p-5">
            <div className="mb-4 flex items-center justify-between border-b border-[#9ca3af] px-2 pb-3">
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#64748b]">
                    Exploraciones registradas
                </p>

                <p className="text-[11px] uppercase tracking-[0.25em] text-[#64748b]">
                    Found: {explorations.length.toString().padStart(4, "0")}
                </p>
            </div>

            <div className="max-h-[340px] overflow-y-auto pr-2">
                {explorations.length === 0 ? (
                    <div className="py-16 text-center text-sm uppercase tracking-[0.25em] text-[#f05a28]">
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
                                            <p className={infoLabelClass}>
                                                Duración
                                            </p>
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
        </div>
    );
}