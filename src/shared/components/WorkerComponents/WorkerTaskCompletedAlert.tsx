import { Award, CheckSquare } from "lucide-react";

type WorkerTaskCompletedAlertProps = {
  lastCompleted: {
    alreadyCompleted?: boolean | null;
    taskName?: string | null;
    pointsAwarded?: number | null;
    points?: {
      totalPoints?: number | null;
      total_points?: number | null;
      level?: number | string | null;
    } | null;
    unlockedAchievements?: unknown[] | null;
  };
  clearLastCompleted: () => void;
};

export function WorkerTaskCompletedAlert({
  lastCompleted,
  clearLastCompleted,
}: WorkerTaskCompletedAlertProps) {
  return (
    <div className="p-4 bg-black/70 backdrop-blur-sm border border-[#22C55E]/50 text-[#22C55E] font-mono text-xs space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-start sm:items-center gap-2 min-w-0">
          <CheckSquare
            size={17}
            className="text-[#22C55E] shrink-0 mt-0.5 sm:mt-0"
          />
          <span className="font-bold uppercase tracking-[0.14em] break-words">
            Task completed successfully
          </span>
        </div>

        <button
          type="button"
          onClick={clearLastCompleted}
          className="text-[#9A9A9A] hover:text-[#22C55E] uppercase tracking-[0.14em] self-end sm:self-auto shrink-0"
        >
          Close
        </button>
      </div>

      <p className="text-[#D0D0D0] break-words">
        {lastCompleted.alreadyCompleted
          ? "This task was already completed. No new points were awarded."
          : `The task "${lastCompleted.taskName ?? "N/A"}" was completed. You earned +${lastCompleted.pointsAwarded ?? 0} points.`}
      </p>

      {lastCompleted.points && (
        <p className="text-[#D0D0D0] break-words">
          Current points:{" "}
          <strong className="text-[#FACC15]">
            {lastCompleted.points.totalPoints ??
              lastCompleted.points.total_points ??
              0}
          </strong>{" "}
          | Level:{" "}
          <strong className="text-[#FACC15]">
            {lastCompleted.points.level ?? "N/A"}
          </strong>
        </p>
      )}

      {!!lastCompleted.unlockedAchievements?.length && (
        <div className="border border-[#FACC15]/40 bg-black/65 p-3 text-[#FACC15]">
          <div className="flex items-center gap-2 font-bold uppercase tracking-[0.14em]">
            <Award size={15} className="shrink-0" />
            <span className="break-words">New achievements unlocked</span>
          </div>

          <p className="mt-1 text-[#D0D0D0] break-words">
            {`${lastCompleted.unlockedAchievements.length} new achievement(s) unlocked.`}
          </p>
        </div>
      )}
    </div>
  );
}