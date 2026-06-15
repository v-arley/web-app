import { MapPinned, ShieldCheck } from "lucide-react";
import type { Camp } from "../../../models/Camp";

type Props = {
  selectedCamp: Camp | null;
};

const detailCardClass = "bg-white/5 px-4 py-3";

const detailLabelClass =
  "text-[10px] uppercase tracking-[0.25em] text-[#9CA3AF]";

function getCoordinates(camp: Camp) {
  return camp.location_x !== undefined && camp.location_y !== undefined
    ? `${camp.location_x}, ${camp.location_y}`
    : "Sin coordenadas";
}

function getStateLabel(active?: boolean) {
  return active ? "Activo" : "Inactivo";
}

export default function CampDetailPanel({ selectedCamp }: Props) {
  return (
    <aside className="w-full xl:max-w-[360px]">
      <div className="rounded-xl bg-[#232323] p-6 text-white shadow-[0_0_18px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <MapPinned className="text-[#FF6600]" />
          <div>
            <p className={detailLabelClass}>Camp detail</p>
            <h3 className="mt-1 text-2xl">
              {selectedCamp?.code ?? "----"}
            </h3>
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
              <p className="mt-2 text-lg">
                {selectedCamp?.capacity ?? "--"}
              </p>
            </div>

            <div className={detailCardClass}>
              <p className={detailLabelClass}>State</p>
              <p
                className={`mt-2 text-lg ${
                  selectedCamp?.active ? "text-green-400" : "text-red-400"
                }`}
              >
                {getStateLabel(selectedCamp?.active)}
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
              {selectedCamp?.user_admin_id
                ? `Admin #${selectedCamp.user_admin_id}`
                : "Sin asignar"}
            </p>
          </div>

          <div className={detailCardClass}>
            <p className={detailLabelClass}>Registry ID</p>
            <p className="mt-2">#{selectedCamp?.id ?? "--"}</p>
          </div>
        </div>

        <div className="btn-group">
          <button type="button" className="btn btn--primary flex-1">
            Editar
          </button>

          <button type="button" className="btn btn--outline flex-1">
            Ver más
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-[11px] uppercase tracking-[0.25em] text-[#9CA3AF]">
          <ShieldCheck className="h-4 w-4 text-green-400" />
          System record available
        </div>
      </div>
    </aside>
  );
}