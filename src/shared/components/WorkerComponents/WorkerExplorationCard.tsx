import {
  ChevronDown,
  ChevronUp,
  Clock,
  Map,
  UserCheck,
} from "lucide-react";
import type { Exploration } from "../../../models/Exploration";
import {
  formatDate,
  formatDateTime,
  getCampId,
  getDepartureDate,
  getDuration,
  getReturnDate,
  getRiskLabel,
  getRiskLevel,
  getRiskStyle,
  getStateLabel,
  getStateStyle,
} from "./workerExplorationUtils";

type WorkerExplorationCardProps = {
  exploration: Exploration;
  expanded: boolean;
  onToggle: () => void;
};

export function WorkerExplorationCard({
  exploration,
  expanded,
  onToggle,
}: WorkerExplorationCardProps) {
  const risk = getRiskLevel(exploration);
  const duration = getDuration(exploration);

  return (
    <article className="border border-white/10 bg-black/70 backdrop-blur-sm overflow-hidden hover:border-[#E85D04]/50 transition-colors">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[#E85D04]/10 transition-colors text-left"
      >
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 font-mono min-w-0">
            <span className="text-[#E85D04] font-bold text-xs uppercase tracking-[0.16em] break-all">
              {exploration.code || `EXP-${exploration.id}`}
            </span>

            <span className="text-[#7C7C7C] shrink-0">//</span>

            <span className="text-white font-bold text-sm uppercase tracking-[0.16em] break-words min-w-0">
              {exploration.name || "Nameless Exploration"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#D0D0D0] font-mono">
            <span className="flex items-center gap-1 min-w-0">
              <UserCheck size={14} className="text-[#38BDF8] shrink-0" />
              <span className="shrink-0">Role:</span>{" "}
              <strong className="text-white font-medium break-words min-w-0">
                {exploration.roleName || "N/A"}
              </strong>
            </span>

            <span className="text-white/15 font-bold hidden sm:inline">•</span>

            <span className="flex items-center gap-1 min-w-0">
              <Clock size={14} className="text-[#FACC15] shrink-0" />
              <span className="shrink-0">Duration:</span>{" "}
              <strong className="text-white font-medium whitespace-nowrap">
                {duration ? `${duration} day('s)` : "N/A"}
              </strong>
            </span>

            <span className="text-white/15 font-bold hidden sm:inline">•</span>

            <span className="flex items-center gap-1 min-w-0">
              <Map size={14} className="text-[#E85D04] shrink-0" />
              <span className="shrink-0">Camp:</span>{" "}
              <strong className="text-[#38BDF8] font-medium break-words min-w-0">
                {getCampId(exploration) ?? "N/A"}
              </strong>
            </span>
          </div>
        </div>

        <div className="shrink-0 flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          <span
            className={`px-2.5 py-0.5 tracking-[0.14em] font-mono text-[9px] border uppercase font-bold whitespace-nowrap ${getRiskStyle(
              risk,
            )}`}
          >
            Risk {getRiskLabel(exploration)}
          </span>

          <span
            className={`px-2.5 py-0.5 tracking-[0.14em] font-mono text-[9px] border uppercase font-bold whitespace-nowrap ${getStateStyle(
              exploration.state,
            )}`}
          >
            {getStateLabel(exploration)}
          </span>

          <span className="p-1 text-[#C0C0C0] ml-auto md:ml-0">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/10 bg-black/65 backdrop-blur-sm p-4 sm:p-5 font-mono text-xs text-[#D0D0D0] space-y-4">
          <div className="p-3 bg-black/70 border border-white/10 leading-normal">
            <span className="text-[#9A9A9A] text-[10px] uppercase block mb-1 font-bold tracking-[0.14em]">
              Objective
            </span>

            <p className="text-white text-xs leading-relaxed break-words">
              {exploration.objective || "No objective registered."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-white/10 p-3 bg-black/70 min-w-0">
              <span className="text-[#9A9A9A] text-[9px] block uppercase tracking-[0.14em]">
                Calendar
              </span>

              <div className="mt-2 space-y-2 font-medium text-white">
                <p className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 border-b border-white/10 pb-1">
                  <span className="text-[#9A9A9A]">Assignment</span>
                  <span className="text-[#38BDF8] break-words sm:text-right">
                    {formatDateTime(exploration.assignedAt)}
                  </span>
                </p>

                <p className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 border-b border-white/10 pb-1">
                  <span className="text-[#9A9A9A]">Departure date</span>
                  <span className="break-words sm:text-right">
                    {formatDateTime(getDepartureDate(exploration))}
                  </span>
                </p>

                <p className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
                  <span className="text-[#9A9A9A]">Return date</span>
                  <span className="break-words sm:text-right">
                    {formatDateTime(getReturnDate(exploration))}
                  </span>
                </p>
              </div>
            </div>

            <div className="border border-white/10 p-3 bg-black/70 md:col-span-2 min-w-0">
              <span className="text-[#9A9A9A] text-[9px] block uppercase tracking-[0.14em]">
                Notes
              </span>

              <p className="mt-2 text-xs text-[#FACC15] bg-black/65 p-3 border border-[#FACC15]/30 leading-relaxed break-words">
                {exploration.notes || "No notes registered."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="border border-white/10 bg-black/70 p-3 min-w-0">
              <span className="text-[#9A9A9A] block text-[9px] uppercase">
                ID
              </span>
              <strong className="text-[#38BDF8] break-words">
                #{exploration.id}
              </strong>
            </div>

            <div className="border border-white/10 bg-black/70 p-3 min-w-0">
              <span className="text-[#9A9A9A] block text-[9px] uppercase">
                State
              </span>
              <strong className="text-white break-words">
                {getStateLabel(exploration)}
              </strong>
            </div>

            <div className="border border-white/10 bg-black/70 p-3 min-w-0">
              <span className="text-[#9A9A9A] block text-[9px] uppercase">
                Risk
              </span>
              <strong className="text-white break-words">
                {getRiskLabel(exploration)}
              </strong>
            </div>

            <div className="border border-white/10 bg-black/70 p-3 min-w-0">
              <span className="text-[#9A9A9A] block text-[9px] uppercase">
                Created
              </span>
              <strong className="text-white break-words">
                {formatDate(exploration.createdAt)}
              </strong>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}