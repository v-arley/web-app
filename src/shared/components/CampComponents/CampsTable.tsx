import { Eye, Pencil } from "lucide-react";
import type { Camp } from "../../../models/Camp";

type Props = {
  camps: Camp[];
  selectedCamp: Camp | null;
  isLoading: boolean;
  error: string | null;
  onSelectCamp: (camp: Camp) => void;
  onReload: () => void;
};

const GRID_COLS =
  "grid-cols-[50px_90px_minmax(220px,1.6fr)_90px_140px_100px_100px_90px]";

const actionButtonClass =
  "inline-flex items-center justify-center rounded-md border border-[#FF6600] p-2 text-[#FF6600] transition-colors hover:bg-[#FF6600] hover:text-black";

function getCoordinates(camp: Camp) {
  return camp.location_x !== undefined && camp.location_y !== undefined
    ? `${camp.location_x}, ${camp.location_y}`
    : "Sin coordenadas";
}

function getStateLabel(active?: boolean) {
  return active ? "Activo" : "Inactivo";
}

function getStateBadgeClass(active?: boolean) {
  return active
    ? "bg-green-500/15 text-green-600"
    : "bg-red-500/15 text-red-500";
}

export default function CampsTable({
  camps,
  selectedCamp,
  isLoading,
  error,
  onSelectCamp,
  onReload,
}: Props) {
  return (
    <div className="rounded-xl bg-[#cecece] p-[25px] shadow-[0_0_18px_rgba(0,0,0,0.35),inset_0_0_14px_rgba(115,115,115,0.33)]">
      {isLoading ? (
        <div className="py-16 text-center text-sm uppercase tracking-[0.25em] text-[#666]">
          Cargando campamentos...
        </div>
      ) : error ? (
        <div className="py-16 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-[#f05a28]">
            {error}
          </p>

          <button
            type="button"
            onClick={onReload}
            className="mt-6 rounded-lg border border-black bg-black px-4 py-2 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
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
            {camps.length === 0 ? (
              <div className="py-16 text-center text-sm uppercase tracking-[0.25em] text-[#f05a28]">
                No se encontraron campamentos
              </div>
            ) : (
              camps.map((camp) => (
                <div
                  key={camp.id}
                  onClick={() => onSelectCamp(camp)}
                  className={`mt-4 cursor-pointer rounded-xl border px-4 py-5 transition-all duration-250 ease-out ${
                    selectedCamp?.id === camp.id
                      ? "border-[#FF6600] bg-[#1f1f1f] text-white shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
                      : "border-[#c7c7c7] bg-[#f7f7f7] text-[#222] hover:-translate-y-[1px] hover:border-[#FF6600]"
                  }`}
                >
                  <div
                    className={`hidden xl:grid ${GRID_COLS} min-w-0 items-start gap-4`}
                  >
                    <div className="text-sm">{camp.id}</div>

                    <div className="text-sm font-bold">{camp.code}</div>

                    <div className="min-w-0">
                      <p className="break-words text-sm leading-relaxed">
                        {camp.description || "Sin descripción"}
                      </p>
                    </div>

                    <div className="text-sm">{camp.capacity}</div>

                    <div className="text-sm">{getCoordinates(camp)}</div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${getStateBadgeClass(
                          camp.active,
                        )}`}
                      >
                        {getStateLabel(camp.active)}
                      </span>
                    </div>

                    <div className="text-sm">
                      {camp.user_admin_id
                        ? `Admin #${camp.user_admin_id}`
                        : "Sin asignar"}
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
                        <p>
                          {camp.user_admin_id
                            ? `Admin #${camp.user_admin_id}`
                            : "Sin asignar"}
                        </p>
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
                            camp.active,
                          )}`}
                        >
                          {getStateLabel(camp.active)}
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
              Found: {camps.length.toString().padStart(4, "0")}
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
        </>
      )}
    </div>
  );
}