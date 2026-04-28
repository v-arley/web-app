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
    return (
        <div className="w-full h-full flex flex-col bg-[#f0f2f5] overflow-y-auto shadow-inner">
            {/* Top Bar Navigation */}
            <div className="w-full bg-[#e5e7eb] px-8 py-3 flex items-center justify-between">
                <div className="text-[12px] font-mono tracking-[0.2em] text-[#888] uppercase font-bold">
                    Camps
                </div>
                <div className="flex bg-[#d1d5db] p-1 shadow-inner gap-1">
                    <button className="px-6 text-[11px] font-bold bg-white text-[#f05a28] shadow-sm uppercase font-mono tracking-widest">Tasks</button>
                    <button className="px-6 text-[11px] font-bold text-[#666] hover:bg-white/50 uppercase font-mono tracking-widest transition-colors cursor-pointer">Rations</button>
                    <button className="px-6 text-[11px] font-bold text-[#666] hover:bg-white/50 uppercase font-mono tracking-widest transition-colors cursor-pointer">Explorations</button>
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
    //     </aside>
    //   </div>
    // </div>
  );
}