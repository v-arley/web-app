import { useMemo, useState } from "react";
import {
  BadgeAlert,
  Binoculars,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";

type RiskLevel = "L" | "M" | "H";
type ExplorationState = "P" | "A" | "F" | "C";
type Filter = "todas" | "L" | "M" | "H";
type StateFilter = "todas" | "P" | "A" | "F" | "C";

type ExplorationRow = {
  id: number;
  camp_id: number;
  code: string;
  name: string;
  objective?: string;
  notes?: string;
  departure_date: string;
  estimated_return_date?: string;
  duration_days?: number;
  risk_level?: RiskLevel;
  state?: ExplorationState;
};

const explorations: ExplorationRow[] = [
  {
    id: 1,
    camp_id: 1,
    code: "EXP-001",
    name: "Reconocimiento norte",
    objective: "Explorar rutas seguras y detectar recursos recuperables.",
    notes: "Evitar zona rocosa al oeste.",
    departure_date: "2026-04-22",
    estimated_return_date: "2026-04-25",
    duration_days: 3,
    risk_level: "M",
    state: "A",
  },
  {
    id: 2,
    camp_id: 2,
    code: "EXP-002",
    name: "Búsqueda de suministros médicos",
    objective: "Localizar botiquines y material quirúrgico en hospital abandonado.",
    notes: "Posible presencia hostil en el perímetro.",
    departure_date: "2026-04-24",
    estimated_return_date: "2026-04-27",
    duration_days: 3,
    risk_level: "H",
    state: "P",
  },
  {
    id: 3,
    camp_id: 1,
    code: "EXP-003",
    name: "Inspección de punto hídrico",
    objective: "Verificar acceso y estado de reserva de agua subterránea.",
    notes: "Llevar equipo de extracción manual.",
    departure_date: "2026-04-18",
    estimated_return_date: "2026-04-19",
    duration_days: 1,
    risk_level: "L",
    state: "F",
  },
  {
    id: 4,
    camp_id: 3,
    code: "EXP-004",
    name: "Ruta de observación este",
    objective: "Registrar movimientos y actividad cercana al perímetro exterior.",
    notes: "Revisión cancelada por tormenta.",
    departure_date: "2026-04-16",
    estimated_return_date: "2026-04-17",
    duration_days: 1,
    risk_level: "M",
    state: "C",
  },
];

const GRID_COLS =
  "grid-cols-[45px_90px_minmax(200px,1.35fr)_105px_105px_85px_95px_95px_75px]";

const metricCardClass =
  "border border-[#d7d7d7] bg-[#f7f7f7] px-6 py-5 shadow-sm";

const detailCardClass = "bg-white/5 px-4 py-3";

const detailLabelClass =
  "text-[10px] uppercase tracking-[0.25em] text-[#9CA3AF]";

const filterSelectClass = (focused: boolean) =>
  `w-full rounded-lg border px-4 py-2 outline-none transition-all duration-200 hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)] xl:w-auto ${
    focused
      ? "border-[#FF6600] bg-[#FF6600] text-black"
      : "border-black bg-black text-white hover:border-[#FF6600] hover:text-[#FF6600]"
  }`;

function getRiskLabel(level?: RiskLevel) {
  if (level === "L") return "Bajo";
  if (level === "M") return "Medio";
  if (level === "H") return "Alto";
  return "N/D";
}

function getRiskBadge(level?: RiskLevel) {
  if (level === "L") return "bg-blue-500/15 text-blue-600";
  if (level === "M") return "bg-orange-500/15 text-orange-600";
  if (level === "H") return "bg-red-500/15 text-red-500";
  return "bg-gray-500/15 text-gray-600";
}

function getStateLabel(state?: ExplorationState) {
  if (state === "P") return "Pendiente";
  if (state === "A") return "Activa";
  if (state === "F") return "Finalizada";
  if (state === "C") return "Cancelada";
  return "N/D";
}

function getStateBadge(state?: ExplorationState) {
  if (state === "P") return "bg-yellow-500/15 text-yellow-600";
  if (state === "A") return "bg-green-500/15 text-green-600";
  if (state === "F") return "bg-blue-500/15 text-blue-600";
  if (state === "C") return "bg-red-500/15 text-red-500";
  return "bg-gray-500/15 text-gray-600";
}

function getDuration(days?: number) {
  return days !== undefined ? `${days} día${days === 1 ? "" : "s"}` : "N/D";
}

function getCampLabel(campId?: number) {
  return campId ? `Camp #${campId}` : "--";
}

export function ExplorationsView() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<Filter>("todas");
  const [stateFilter, setStateFilter] = useState<StateFilter>("todas");
  const [selectedExploration, setSelectedExploration] = useState<ExplorationRow | null>(
    explorations[0] ?? null,
  );
  const [isRiskFocused, setIsRiskFocused] = useState(false);
  const [isStateFocused, setIsStateFocused] = useState(false);

  const filteredExplorations = useMemo(() => {
    const q = search.trim().toLowerCase();

    return explorations.filter((exploration) => {
      const matchesSearch =
        !q ||
        exploration.code.toLowerCase().includes(q) ||
        exploration.name.toLowerCase().includes(q) ||
        (exploration.objective ?? "").toLowerCase().includes(q);

      const matchesRisk =
        riskFilter === "todas" || exploration.risk_level === riskFilter;

      const matchesState =
        stateFilter === "todas" || exploration.state === stateFilter;

      return matchesSearch && matchesRisk && matchesState;
    });
  }, [search, riskFilter, stateFilter]);

  const activeCount = explorations.filter((e) => e.state === "A").length;
  const highRiskCount = explorations.filter((e) => e.risk_level === "H").length;

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col gap-6 p-4 font-mono sm:gap-7 sm:p-6 lg:p-[30px]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={metricCardClass}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
            Total explorations
          </p>
          <p className="mt-3 text-4xl font-bold text-[#111]">{explorations.length}</p>
        </div>

        <div className={metricCardClass}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
            Active explorations
          </p>
          <p className="mt-3 text-4xl font-bold text-[#f05a28]">{activeCount}</p>
        </div>

        <div className={metricCardClass}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
            High risk
          </p>
          <p className="mt-3 text-4xl font-bold text-[#111]">{highRiskCount}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
        <section className="min-w-0 flex-1">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-stretch gap-3 xl:flex-row xl:items-center xl:gap-4">
              <div className="group flex w-full flex-1 items-center gap-3 rounded-lg border border-[#B8B8B8] bg-[#CCCCCC] px-3 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.10)] transition-colors focus-within:border-[#FF6600] sm:gap-5 sm:py-[15px] lg:gap-[30px]">
                <Search className="self-center text-gray-500 transition-colors group-focus-within:text-[#FF6600]" />
                <input
                  type="text"
                  placeholder="Buscar exploración por código, nombre u objetivo..."
                  className="w-full self-center bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as Filter)}
                onFocus={() => setIsRiskFocused(true)}
                onBlur={() => setIsRiskFocused(false)}
                className={filterSelectClass(isRiskFocused)}
              >
                <option value="todas">Riesgo</option>
                <option value="L">Bajo</option>
                <option value="M">Medio</option>
                <option value="H">Alto</option>
              </select>

              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value as StateFilter)}
                onFocus={() => setIsStateFocused(true)}
                onBlur={() => setIsStateFocused(false)}
                className={filterSelectClass(isStateFocused)}
              >
                <option value="todas">Estado</option>
                <option value="P">Pendiente</option>
                <option value="A">Activa</option>
                <option value="F">Finalizada</option>
                <option value="C">Cancelada</option>
              </select>

              <button
                type="button"
                className="group flex w-full items-center justify-center gap-[10px] rounded-lg border border-black bg-black px-4 py-2 text-white transition-colors hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black xl:w-auto xl:justify-start"
              >
                <Plus className="text-white transition-colors group-hover:text-black" />
                Nueva exploración
              </button>
            </div>

            <div className="flex w-full items-center gap-[10px] border-b border-[#B8B8B8] px-3 py-2 text-[#343434] shadow-[0_10px_8px_-8px_rgba(0,0,0,0.45)]">
              <Binoculars className="h-8 w-8 rounded-md bg-[#A6A6A6] p-1 text-[#343434]" />
              <p>LISTA GENERAL DE EXPLORACIONES</p>
            </div>

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
                {filteredExplorations.length === 0 ? (
                  <div className="py-16 text-center text-sm uppercase tracking-[0.25em] text-[#f05a28]">
                    No se encontraron exploraciones
                  </div>
                ) : (
                  filteredExplorations.map((exploration) => (
                    <div
                      key={exploration.id}
                      onClick={() => setSelectedExploration(exploration)}
                      className={`mt-4 rounded-xl border px-4 py-5 transition-all duration-250 ease-out cursor-pointer ${
                        selectedExploration?.id === exploration.id
                          ? "border-[#FF6600] bg-[#1f1f1f] text-white shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
                          : "border-[#c7c7c7] bg-[#f7f7f7] text-[#222] hover:-translate-y-[1px] hover:border-[#FF6600]"
                      }`}
                    >
                      <div className={`hidden xl:grid ${GRID_COLS} gap-4 items-start min-w-0`}>
                        <div className="text-sm">{exploration.id}</div>
                        <div className="text-sm font-bold">{exploration.code}</div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold leading-relaxed break-words">
                            {exploration.name}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-[#8b8b8b] break-words">
                            {exploration.objective || "Sin objetivo"}
                          </p>
                        </div>
                        <div className="text-sm">{exploration.departure_date}</div>
                        <div className="text-sm">{exploration.estimated_return_date || "N/D"}</div>
                        <div className="text-sm">{getDuration(exploration.duration_days)}</div>
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
                        <div className="text-sm">{getCampLabel(exploration.camp_id)}</div>
                      </div>

                      <div className="flex flex-col gap-3 xl:hidden">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold">{exploration.name}</p>
                            <p className="mt-1 text-xs text-[#8b8b8b]">
                              {exploration.objective || "Sin objetivo"}
                            </p>
                          </div>
                          <span className="text-sm">{exploration.code}</span>
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
                            <p>{exploration.estimated_return_date || "N/D"}</p>
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
                  Found: {filteredExplorations.length.toString().padStart(4, "0")}
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
          </div>
        </section>

        <aside className="w-full xl:max-w-[360px]">
          <div className="rounded-xl bg-[#232323] p-6 text-white shadow-[0_0_18px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <BadgeAlert className="text-[#FF6600]" />
              <div>
                <p className={detailLabelClass}>Exploration detail</p>
                <h3 className="mt-1 text-2xl">{selectedExploration?.name ?? "----"}</h3>
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
                <p className="mt-2">{selectedExploration?.departure_date || "--"}</p>
                <p className="text-[#bdbdbd]">
                  {selectedExploration?.estimated_return_date || "--"}
                </p>
              </div>

              <div className={detailCardClass}>
                <p className={detailLabelClass}>Duration</p>
                <p className="mt-2">{getDuration(selectedExploration?.duration_days)}</p>
              </div>

              <div className={detailCardClass}>
                <p className={detailLabelClass}>Camp</p>
                <p className="mt-2">{getCampLabel(selectedExploration?.camp_id)}</p>
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
      </div>
    </div>
  );
}