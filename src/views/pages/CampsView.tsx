import { useMemo, useState } from "react";
import {
  Building2,
  Eye,
  MapPinned,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";

type CampState = "A" | "I";
type StateFilter = "activos" | "inactivos" | "todos";

type CampRow = {
  id: number;
  code: string;
  description?: string;
  capacity: number;
  location_x?: number;
  location_y?: number;
  state: CampState;
  admin_id?: number;
};

const camps: CampRow[] = [
  {
    id: 1,
    code: "ALPHA",
    description: "Campamento principal de coordinación y defensa",
    capacity: 250,
    location_x: 120.45,
    location_y: 88.12,
    state: "A",
    admin_id: 4,
  },
  {
    id: 2,
    code: "BETA",
    description: "Centro de abastecimiento y soporte médico",
    capacity: 180,
    location_x: 96.2,
    location_y: 41.8,
    state: "A",
    admin_id: 7,
  },
  {
    id: 3,
    code: "DELTA",
    description: "Puesto avanzado de monitoreo y vigilancia",
    capacity: 90,
    location_x: 144.1,
    location_y: 63.4,
    state: "I",
    admin_id: 2,
  },
  {
    id: 4,
    code: "OMEGA",
    description: "Campamento logístico para traslado de recursos",
    capacity: 140,
    location_x: 78.9,
    location_y: 22.5,
    state: "A",
    admin_id: 9,
  },
];

const GRID_COLS =
  "grid-cols-[50px_90px_minmax(220px,1.6fr)_90px_140px_100px_100px_90px]";

const metricCardClass =
  "border border-[#d7d7d7] bg-[#f7f7f7] px-6 py-5 shadow-sm";

const filterSelectClass = (focused: boolean) =>
  `w-full rounded-lg border px-4 py-2 outline-none transition-all duration-200 hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)] xl:w-auto ${
    focused
      ? "border-[#FF6600] bg-[#FF6600] text-black"
      : "border-black bg-black text-white hover:border-[#FF6600] hover:text-[#FF6600]"
  }`;

const actionButtonClass =
  "inline-flex items-center justify-center rounded-md border border-[#FF6600] p-2 text-[#FF6600] transition-colors hover:bg-[#FF6600] hover:text-black";

const detailCardClass = "bg-white/5 px-4 py-3";

const detailLabelClass =
  "text-[10px] uppercase tracking-[0.25em] text-[#9CA3AF]";

function getCoordinates(camp: CampRow) {
  return camp.location_x !== undefined && camp.location_y !== undefined
    ? `${camp.location_x}, ${camp.location_y}`
    : "Sin coordenadas";
}

function getStateLabel(state?: CampState) {
  return state === "A" ? "Activo" : "Inactivo";
}

function getStateBadgeClass(state?: CampState) {
  return state === "A"
    ? "bg-green-500/15 text-green-600"
    : "bg-red-500/15 text-red-500";
}

export function CampsView() {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<StateFilter>("todos");
  const [selectedCamp, setSelectedCamp] = useState<CampRow | null>(camps[0] ?? null);
  const [isFilterFocused, setIsFilterFocused] = useState(false);

  const filteredCamps = useMemo(() => {
    const q = search.trim().toLowerCase();

    return camps.filter((camp) => {
      const matchesSearch =
        !q ||
        camp.code.toLowerCase().includes(q) ||
        (camp.description ?? "").toLowerCase().includes(q);

      const matchesState =
        stateFilter === "todos"
          ? true
          : stateFilter === "activos"
            ? camp.state === "A"
            : camp.state === "I";

      return matchesSearch && matchesState;
    });
  }, [search, stateFilter]);

  const totalActive = camps.filter((camp) => camp.state === "A").length;
  const totalCapacity = camps.reduce((acc, camp) => acc + camp.capacity, 0);

  const sectionTitle =
    stateFilter === "activos"
      ? "CAMPAMENTOS ACTIVOS"
      : stateFilter === "inactivos"
        ? "CAMPAMENTOS INACTIVOS"
        : "TODOS LOS CAMPAMENTOS";

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col gap-6 p-4 font-mono sm:gap-7 sm:p-6 lg:p-[30px]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={metricCardClass}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
            Total camps
          </p>
          <p className="mt-3 text-4xl font-bold text-[#111]">{camps.length}</p>
        </div>

        <div className={metricCardClass}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
            Active camps
          </p>
          <p className="mt-3 text-4xl font-bold text-[#f05a28]">{totalActive}</p>
        </div>

        <div className={metricCardClass}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
            Total capacity
          </p>
          <p className="mt-3 text-4xl font-bold text-[#111]">{totalCapacity}</p>
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
                  placeholder="Buscar campamento por código o descripción..."
                  className="w-full self-center bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value as StateFilter)}
                onFocus={() => setIsFilterFocused(true)}
                onBlur={() => setIsFilterFocused(false)}
                className={filterSelectClass(isFilterFocused)}
              >
                <option value="todos">Todos</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>

              <button
                type="button"
                className="group flex w-full items-center justify-center gap-[10px] rounded-lg border border-black bg-black px-4 py-2 text-white transition-colors hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black xl:w-auto xl:justify-start"
              >
                <Plus className="text-white transition-colors group-hover:text-black" />
                Nuevo campamento
              </button>
            </div>

            <div className="flex w-full items-center gap-[10px] border-b border-[#B8B8B8] px-3 py-2 text-[#343434] shadow-[0_10px_8px_-8px_rgba(0,0,0,0.45)]">
              <Building2 className="h-8 w-8 rounded-md bg-[#A6A6A6] p-1 text-[#343434]" />
              <p>{sectionTitle}</p>
            </div>

            <div className="rounded-xl bg-[#cecece] p-[25px] shadow-[0_0_18px_rgba(0,0,0,0.35),inset_0_0_14px_rgba(115,115,115,0.33)]">
              <div
                className={`hidden xl:grid ${GRID_COLS} gap-4 border-b border-[#9ca3af] px-4 py-4 text-[11px] uppercase tracking-[0.25em] text-[#64748b]`}
              >
                <span>ID</span>
                <span>Código</span>
                <span>Descripción</span>
                <span>Capacidad</span>
                <span>Ubicación</span>
                <span>Estado</span>
                <span>Admin</span>
                <span>Acciones</span>
              </div>

              <div className="flex flex-col">
                {filteredCamps.length === 0 ? (
                  <div className="py-16 text-center text-sm uppercase tracking-[0.25em] text-[#f05a28]">
                    No se encontraron campamentos
                  </div>
                ) : (
                  filteredCamps.map((camp) => (
                    <div
                      key={camp.id}
                      onClick={() => setSelectedCamp(camp)}
                      className={`mt-4 rounded-xl border px-4 py-5 transition-all duration-250 ease-out cursor-pointer ${
                        selectedCamp?.id === camp.id
                          ? "border-[#FF6600] bg-[#1f1f1f] text-white shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
                          : "border-[#c7c7c7] bg-[#f7f7f7] text-[#222] hover:-translate-y-[1px] hover:border-[#FF6600]"
                      }`}
                    >
                      <div
                        className={`hidden xl:grid ${GRID_COLS} gap-4 items-start min-w-0`}
                      >
                        <div className="text-sm">{camp.id}</div>

                        <div className="text-sm font-bold">{camp.code}</div>

                        <div className="min-w-0">
                          <p className="text-sm leading-relaxed break-words">
                            {camp.description || "Sin descripción"}
                          </p>
                        </div>

                        <div className="text-sm">{camp.capacity}</div>

                        <div className="text-sm">{getCoordinates(camp)}</div>

                        <div>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${getStateBadgeClass(
                              camp.state,
                            )}`}
                          >
                            {getStateLabel(camp.state)}
                          </span>
                        </div>

                        <div className="text-sm">
                          {camp.admin_id ? `Admin #${camp.admin_id}` : "Sin asignar"}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className={actionButtonClass}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className={actionButtonClass}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 xl:hidden">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold">{camp.code}</p>
                            <p className="mt-1 text-xs text-[#8b8b8b]">
                              {camp.description || "Sin descripción"}
                            </p>
                          </div>
                          <span className="text-sm">#{camp.id}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#7c8794]">
                              Capacidad
                            </p>
                            <p>{camp.capacity}</p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#7c8794]">
                              Admin
                            </p>
                            <p>{camp.admin_id ? `Admin #${camp.admin_id}` : "Sin asignar"}</p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#7c8794]">
                              Ubicación
                            </p>
                            <p>{getCoordinates(camp)}</p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#7c8794]">
                              Estado
                            </p>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${getStateBadgeClass(
                                camp.state,
                              )}`}
                            >
                              {getStateLabel(camp.state)}
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
                  Found: {filteredCamps.length.toString().padStart(4, "0")}
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
              <MapPinned className="text-[#FF6600]" />
              <div>
                <p className={detailLabelClass}>Camp detail</p>
                <h3 className="mt-1 text-2xl">{selectedCamp?.code ?? "----"}</h3>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className={detailCardClass}>
                <p className={detailLabelClass}>Description</p>
                <p className="mt-2 text-white">
                  {selectedCamp?.description || "Sin descripción"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={detailCardClass}>
                  <p className={detailLabelClass}>Capacity</p>
                  <p className="mt-2 text-lg">{selectedCamp?.capacity ?? "--"}</p>
                </div>

                <div className={detailCardClass}>
                  <p className={detailLabelClass}>State</p>
                  <p
                    className={`mt-2 text-lg ${
                      selectedCamp?.state === "A" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {getStateLabel(selectedCamp?.state)}
                  </p>
                </div>
              </div>

              <div className={detailCardClass}>
                <p className={detailLabelClass}>Coordinates</p>
                <p className="mt-2">
                  {selectedCamp ? getCoordinates(selectedCamp) : "--"}
                </p>
              </div>

              <div className={detailCardClass}>
                <p className={detailLabelClass}>Administrator</p>
                <p className="mt-2">
                  {selectedCamp?.admin_id ? `Admin #${selectedCamp.admin_id}` : "Sin asignar"}
                </p>
              </div>

              <div className={detailCardClass}>
                <p className={detailLabelClass}>Registry ID</p>
                <p className="mt-2">#{selectedCamp?.id ?? "--"}</p>
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
              System record available
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}