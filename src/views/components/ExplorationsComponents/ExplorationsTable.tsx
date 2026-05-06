import type { ExplorationRow } from "./explorationHelpers";
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

const GRID_COLS =
    "grid-cols-[45px_90px_minmax(200px,1.35fr)_105px_105px_85px_95px_95px_75px]";

export default function ExplorationsTable({
    explorations,
    selectedExploration,
    onSelectExploration,
}: Props) {
    return (
        <div className="rounded-xl bg-[#cecece] p-[25px] shadow-[0_0_18px_rgba(0,0,0,0.35),inset_0_0_14px_rgba(115,115,115,0.33)]">
            <div
                className={`hidden xl:grid ${GRID_COLS} gap-4 border-b border-[#9ca3af] px-4 py-4 text-[11px] uppercase tracking-[0.25em] text-[#64748b]`}
            >
                <span>ID</span>
                <span>Código</span>
                <span>Nombre</span>
                <span>Salida</span>
                <span>Retorno</span>
                <span>Duración</span>
                <span>Riesgo</span>
                <span>Estado</span>
                <span>Camp</span>
            </div>

            <div className="flex flex-col">
                {explorations.length === 0 ? (
                    <div className="py-16 text-center text-sm uppercase tracking-[0.25em] text-[#f05a28]">
                        No se encontraron exploraciones
                    </div>
                ) : (
                    explorations.map((exploration) => (
                        <div
                            key={exploration.id}
                            onClick={() => onSelectExploration(exploration)}
                            className={`mt-4 cursor-pointer rounded-xl border px-4 py-5 transition-all duration-250 ease-out ${
                                selectedExploration?.id === exploration.id
                                    ? "border-[#FF6600] bg-[#1f1f1f] text-white shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
                                    : "border-[#c7c7c7] bg-[#f7f7f7] text-[#222] hover:-translate-y-[1px] hover:border-[#FF6600]"
                            }`}
                        >
                            <div className={`hidden xl:grid ${GRID_COLS} min-w-0 items-start gap-4`}>
                                <div className="text-sm">{exploration.id}</div>

                                <div className="text-sm font-bold">
                                    {exploration.code}
                                </div>

                                <div className="min-w-0">
                                    <p className="break-words text-sm font-bold leading-relaxed">
                                        {exploration.name}
                                    </p>
                                    <p className="mt-1 break-words text-xs leading-relaxed text-[#8b8b8b]">
                                        {exploration.objective || "Sin objetivo"}
                                    </p>
                                </div>

                                <div className="text-sm">
                                    {exploration.departure_date}
                                </div>

                                <div className="text-sm">
                                    {exploration.estimated_return_date || "N/D"}
                                </div>

                                <div className="text-sm">
                                    {getDuration(exploration.duration_days)}
                                </div>

                                <div>
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${getRiskBadge(
                                            exploration.risk_level,
                                        )}`}
                                    >
                                        {getRiskLabel(exploration.risk_level)}
                                    </span>
                                </div>

                                <div>
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${getStateBadge(
                                            exploration.state,
                                        )}`}
                                    >
                                        {getStateLabel(exploration.state)}
                                    </span>
                                </div>

                                <div className="text-sm">
                                    {getCampLabel(exploration.camp_id)}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 xl:hidden">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-bold">
                                            {exploration.name}
                                        </p>
                                        <p className="mt-1 text-xs text-[#8b8b8b]">
                                            {exploration.objective || "Sin objetivo"}
                                        </p>
                                    </div>

                                    <span className="text-sm">
                                        {exploration.code}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#7c8794]">
                                            Salida
                                        </p>
                                        <p>{exploration.departure_date}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#7c8794]">
                                            Retorno
                                        </p>
                                        <p>
                                            {exploration.estimated_return_date || "N/D"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#7c8794]">
                                            Duración
                                        </p>
                                        <p>{getDuration(exploration.duration_days)}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#7c8794]">
                                            Camp
                                        </p>
                                        <p>{getCampLabel(exploration.camp_id)}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
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
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-[#9ca3af] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#64748b]">
                    Found: {explorations.length.toString().padStart(4, "0")}
                </p>

                <div className="flex gap-3">
                    <button className="min-w-[150px] bg-[#e5c0ae] px-6 py-3 text-[12px] font-bold uppercase tracking-[0.3em] text-[#9c9c9c]">
                        Previous
                    </button>

                    <button className="min-w-[150px] bg-[#ababab] px-6 py-3 text-[12px] font-bold uppercase tracking-[0.3em] text-white">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}