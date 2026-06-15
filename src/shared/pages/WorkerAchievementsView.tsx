import { useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useWorkerAchievements } from "../hooks/useWorkerAchievements";
import { WorkerPointsPanel } from "../components/WorkerComponents/achievements/WorkerPointsPanel";
import {
  WorkerAchievementsPanel,
  type AchievementTab,
} from "../components/WorkerComponents/achievements/WorkerAchievementsPanel";

export function WorkerAchievementsView() {
  const {
    points,
    unlocked,
    pending,
    unlockedPage,
    pendingPage,
    setUnlockedPage,
    setPendingPage,
    loading,
    error,
    reload,
  } = useWorkerAchievements();

  const [panelTab, setPanelTab] = useState<AchievementTab>("UNLOCKED");

  const progressPercentage = Math.min(
    Math.max(points?.progressPercentage ?? 0, 0),
    100,
  );

  const unlockedItems = unlocked?.items ?? [];
  const pendingItems = pending?.items ?? [];

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden min-w-0">
      <div className="w-full bg-black/45 backdrop-blur-sm border-b border-white/10 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-mono font-bold text-white uppercase tracking-[0.18em] break-words">
            Achievements & Points
          </span>
          <span className="text-[10px] font-mono text-[#9A9A9A] uppercase tracking-[0.14em] break-words">
            Worker points / unlocked achievements / pending achievements
          </span>
        </div>

        <button
          type="button"
          onClick={() => void reload()}
          className="flex items-center gap-2 border-2 border-[#E85D04]/70 bg-black/70 backdrop-blur-sm px-3 py-1.5 text-[10px] font-mono font-bold text-white uppercase tracking-[0.14em] shadow-[0_0_0_1px_rgba(232,93,4,0.25)] hover:bg-[#E85D04]/10 hover:text-[#E85D04] hover:border-[#E85D04] hover:shadow-[0_0_18px_rgba(232,93,4,0.55)] transition-all shrink-0"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-transparent">
        <div className="p-3 sm:p-4 flex flex-col gap-4">
          {error && (
            <div className="border border-[#E85D04]/50 bg-black/50 backdrop-blur-sm text-[#E85D04] px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] flex items-start sm:items-center gap-2 break-words">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 sm:mt-0" />
              {error}
            </div>
          )}

          <WorkerPointsPanel
            level={points?.level ?? 1}
            totalPoints={points?.totalPoints ?? 0}
            progressToNextLevel={points?.progressToNextLevel ?? 0}
            currentLevelMin={points?.currentLevelMin ?? 0}
            nextLevelMin={points?.nextLevelMin ?? 100}
            progressPercentage={progressPercentage}
          />

          <WorkerAchievementsPanel
            panelTab={panelTab}
            setPanelTab={setPanelTab}
            loading={loading}
            unlockedItems={unlockedItems}
            pendingItems={pendingItems}
            unlockedTotal={unlocked?.total ?? 0}
            pendingTotal={pending?.total ?? 0}
            unlockedPage={unlockedPage}
            pendingPage={pendingPage}
            unlockedCurrentPage={unlocked?.page ?? unlockedPage}
            pendingCurrentPage={pending?.page ?? pendingPage}
            unlockedTotalPages={unlocked?.totalPages ?? 1}
            pendingTotalPages={pending?.totalPages ?? 1}
            setUnlockedPage={setUnlockedPage}
            setPendingPage={setPendingPage}
          />
        </div>
      </div>
    </div>
  );
}
