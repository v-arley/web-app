import { Calendar, Clock } from "lucide-react";
import type { Task } from "../../../models/Task";
import {
  formatDate,
  formatEstimatedTime,
  getAssignedDate,
  getDifficultyLabel,
  getDifficultyPoints,
  getDifficultyStyle,
  getPriorityLabel,
  getPriorityStyle,
} from "./workerTaskUtils";

type WorkerTaskCardProps = {
  task: Task;
  completing: boolean;
  onComplete: (taskId: number) => void;
};

export function WorkerTaskCard({
  task,
  completing,
  onComplete,
}: WorkerTaskCardProps) {
  const points = getDifficultyPoints(task.difficulty);

  return (
    <div className="border border-white/10 bg-black/70 backdrop-blur-sm p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-[#E85D04]/70 hover:bg-[#E85D04]/10 transition-colors min-w-0">
      <div className="space-y-3 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <span className="text-[10px] text-[#9A9A9A] font-mono tracking-[0.14em] uppercase break-all">
            {task.type || "General"} // REF: {task.id}
          </span>

          <span
            className={`px-2 py-0.5 text-[10px] font-mono border uppercase tracking-[0.14em] font-bold w-fit whitespace-nowrap shrink-0 ${getPriorityStyle(
              task.priority,
            )}`}
          >
            Priority {getPriorityLabel(task.priority)}
          </span>
        </div>

        <h3 className="font-mono text-sm text-white font-bold leading-tight tracking-[0.14em] uppercase break-words">
          {task.name || task.title || "Untitled task"}
        </h3>

        <p className="font-mono text-xs text-[#D0D0D0] bg-black/70 p-3 border border-white/10 leading-relaxed break-words">
          {task.description || "No description recorded."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
          <div className="border border-white/10 p-3 bg-black/70 min-w-0">
            <span className="text-[#9A9A9A] block text-[9px] uppercase tracking-[0.14em]">
              Difficulty
            </span>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] font-bold whitespace-nowrap ${getDifficultyStyle(
                  task.difficulty,
                )}`}
              >
                {getDifficultyLabel(task.difficulty)}
              </span>

              <span className="text-[#FACC15] font-bold whitespace-nowrap">
                +{points} pts
              </span>
            </div>
          </div>

          <div className="border border-white/10 p-3 bg-black/70 min-w-0">
            <span className="text-[#9A9A9A] block text-[9px] uppercase tracking-[0.14em]">
              Estimated time
            </span>

            <span className="text-white font-medium flex items-center gap-1 mt-2 break-words">
              <Clock size={13} className="text-[#38BDF8] shrink-0" />
              {formatEstimatedTime(task)}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="font-mono text-[10px] text-[#9A9A9A] flex items-center gap-1 uppercase tracking-[0.14em] break-words">
          <Calendar size={13} className="shrink-0" />
          <span>Asignado: {formatDate(getAssignedDate(task))}</span>
        </div>

        <button
          type="button"
          onClick={() => onComplete(task.id)}
          disabled={completing}
          className="w-full sm:w-auto px-4 py-2 border-2 border-[#E85D04] bg-black/70 text-white shadow-[0_0_18px_rgba(232,93,4,0.55)] ring-1 ring-[#E85D04]/40 hover:bg-[#E85D04] hover:text-[#111111] hover:shadow-[0_0_24px_rgba(232,93,4,0.75)] disabled:opacity-50 disabled:hover:bg-black/60 disabled:hover:text-[#E85D04] font-bold font-mono text-xs uppercase tracking-[0.14em] transition-colors whitespace-nowrap"
        >
          {completing ? "Completing..." : "Complete task"}
        </button>
      </div>
    </div>
  );
}