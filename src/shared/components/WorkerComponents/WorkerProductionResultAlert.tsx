import { Award, Sparkles } from "lucide-react";
import type { WorkerProductionResult } from "../../../models/ResourceProduction";

type WorkerProductionResultAlertProps = {
  lastResult: WorkerProductionResult;
  unit: string;
  clearLastResult: () => void;
};

export function WorkerProductionResultAlert({
  lastResult,
  unit,
  clearLastResult,
}: WorkerProductionResultAlertProps) {
  return (
    <div className="p-4 bg-black/70 backdrop-blur-sm border border-[#22C55E]/50 text-[#22C55E] font-mono text-xs space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-start sm:items-center gap-2 min-w-0">
          <Sparkles
            size={17}
            className="text-[#FACC15] shrink-0 mt-0.5 sm:mt-0"
          />
          <span className="font-bold uppercase tracking-[0.14em] break-words">
            Production recorded successfully
          </span>
        </div>

        <button
          type="button"
          onClick={clearLastResult}
          className="text-[#9A9A9A] hover:text-[#22C55E] uppercase tracking-[0.14em] self-end sm:self-auto shrink-0"
        >
          Close
        </button>
      </div>

      <p className="text-[#D0D0D0] break-words">
        Recorded <strong className="text-[#FACC15]">{lastResult.amount}</strong>{" "}
        {unit}.
      </p>

      {lastResult.pointsAwarded !== undefined && (
        <p className="text-[#D0D0D0] break-words">
          Points awarded:{" "}
          <strong className="text-[#FACC15]">
            +{lastResult.pointsAwarded}
          </strong>
        </p>
      )}

      {lastResult.points && (
        <p className="text-[#D0D0D0] break-words">
          Current total:{" "}
          <strong className="text-[#FACC15]">
            {lastResult.points.totalPoints ??
              lastResult.points.total_points ??
              0}
          </strong>{" "}
          | Level:{" "}
          <strong className="text-[#FACC15]">
            {lastResult.points.level ?? "N/A"}
          </strong>
        </p>
      )}

      {!!lastResult.unlockedAchievements?.length && (
        <div className="border border-[#FACC15]/40 bg-black/65 p-3 text-[#FACC15]">
          <div className="flex items-center gap-2 font-bold uppercase tracking-[0.14em]">
            <Award size={15} className="shrink-0" />
            <span className="break-words">Unlocked achievements</span>
          </div>

          <p className="mt-1 text-[#D0D0D0] break-words">
            Unlocked {lastResult.unlockedAchievements.length} new
            achievement(s).
          </p>
        </div>
      )}
    </div>
  );
}