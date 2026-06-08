import { useState } from "react";
import {
  AlertTriangle,
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Lock,
  RefreshCw,
  Trophy,
  Unlock,
} from "lucide-react";
import { useWorkerAchievements } from "../hooks/useWorkerAchievements";
import type { Achievement } from "../../models/Achievement";

type AchievementTab = "UNLOCKED" | "PENDING";

function formatDate(value?: Date | string | null) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getProgressPercent(current: number, required: number) {
  if (!required || required <= 0) return 0;
  return Math.min(100, Math.round((current / required) * 100));
}

function UnlockedAchievementCard({
  achievement,
}: {
  achievement: Achievement;
}) {
  return (
    <div className="p-4 border border-[#22C55E]/30 bg-black/50 backdrop-blur-sm hover:bg-[#22C55E]/10 hover:border-[#22C55E]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
      <div className="flex items-start gap-4 min-w-0">
        <div className="p-3 bg-black/45 border border-[#22C55E]/50 text-[#22C55E] shrink-0">
          <Unlock size={20} />
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-white text-sm font-mono font-bold tracking-[0.16em] uppercase break-words">
              {achievement.name}
            </h4>

            <span className="bg-[#22C55E]/85 text-[#111111] border border-[#22C55E] text-[9px] px-2 py-0.5 font-mono font-black uppercase tracking-[0.14em] shrink-0">
              {achievement.requiredPoints ?? achievement.points ?? 0} pts
            </span>

            <span className="border border-[#22C55E]/50 text-[#22C55E] bg-black/35 text-[9px] px-2 py-0.5 font-mono font-bold uppercase tracking-[0.14em] shrink-0">
              Unlocked
            </span>
          </div>

          <p className="text-xs text-[#D0D0D0] font-mono leading-relaxed max-w-2xl break-words">
            {achievement.description || "No description available."}
          </p>

          <span className="text-[10px] text-[#22C55E] font-mono uppercase tracking-[0.14em] break-all">
            Code: {achievement.code}
          </span>
        </div>
      </div>

      <div className="shrink-0 text-right font-mono text-xs text-[#22C55E] flex items-center gap-1 self-end sm:self-center whitespace-nowrap">
        <Calendar size={14} />
        <span>Unlocked: {formatDate(achievement.unlockedAt)}</span>
      </div>
    </div>
  );
}

function PendingAchievementCard({ achievement }: { achievement: Achievement }) {
  const currentPoints = achievement.currentPoints ?? 0;
  const requiredPoints = achievement.requiredPoints ?? achievement.points ?? 0;
  const missingPoints =
    achievement.missingPoints ?? Math.max(requiredPoints - currentPoints, 0);
  const progress = getProgressPercent(currentPoints, requiredPoints);

  return (
    <div className="p-4 border border-[#E85D04]/30 bg-black/50 backdrop-blur-sm hover:border-[#E85D04]/55 hover:bg-[#E85D04]/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors">
      <div className="flex items-start gap-4 min-w-0">
        <div className="p-3 bg-black/45 border border-[#E85D04]/50 text-[#E85D04] shrink-0">
          <Lock size={20} />
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[#E0E0E0] text-sm font-mono font-bold tracking-[0.16em] uppercase break-words">
              {achievement.name}
            </h4>

            <span className="text-[9px] text-[#E85D04] border border-[#E85D04]/50 bg-black/35 px-2 py-0.5 font-mono uppercase tracking-[0.14em] font-bold shrink-0">
              Locked
            </span>

            <span className="text-[9px] text-[#A5A9B0] border border-white/10 bg-black/40 px-2 py-0.5 font-mono uppercase tracking-[0.14em] shrink-0">
              {requiredPoints} pts
            </span>
          </div>

          <p className="text-xs text-[#C8CDD5] font-mono leading-relaxed max-w-2xl break-words">
            {achievement.description || "No description available."}
          </p>

          <span className="text-[10px] text-[#E85D04] font-mono uppercase tracking-[0.14em] break-all">
            Code: {achievement.code}
          </span>
        </div>
      </div>

      <div className="shrink-0 w-full md:w-56 font-mono text-[11px] space-y-2 bg-black/45 backdrop-blur-sm p-3 border border-[#E85D04]/30">
        <div className="flex justify-between text-[10px] text-[#D0D0D0] uppercase tracking-[0.14em] gap-3">
          <span>Progress</span>
          <span className="text-[#E85D04] font-bold whitespace-nowrap">
            {currentPoints} / {requiredPoints}
          </span>
        </div>

        <div className="w-full bg-black/50 h-2 border border-white/10 overflow-hidden">
          <div
            className="bg-[#E85D04] h-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[10px] text-[#E85D04] block text-right uppercase tracking-[0.14em] font-bold">
          Missing {missingPoints} pts
        </span>
      </div>
    </div>
  );
}

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
          className="flex items-center gap-2 border border-white/10 bg-black/40 backdrop-blur-sm px-3 py-1.5 text-[10px] font-mono text-[#C0C0C0] hover:text-[#FACC15] hover:border-[#FACC15]/35 uppercase tracking-[0.14em] transition-colors shrink-0"
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

          <section className="border border-[#FACC15]/25 bg-black/50 backdrop-blur-sm p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a2a_1px,transparent_1px),linear-gradient(to_bottom,#2a2a2a_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.04] pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2 text-[#FACC15] font-mono">
                  <Trophy size={20} className="shrink-0" />
                  <span className="text-xs uppercase tracking-[0.16em] font-bold">
                    Points Record
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-mono font-black text-white leading-none uppercase break-words">
                  Level{" "}
                  <span className="text-[#FACC15]">
                    {points?.level ?? 1}
                  </span>
                </h1>

                <p className="text-xs text-[#D0D0D0] font-mono break-words">
                  Progress calculated from the worker&apos;s points record.
                </p>
              </div>

              <div className="shrink-0 w-full sm:w-auto bg-black/45 backdrop-blur-sm border border-[#FACC15]/35 p-4 text-center font-mono">
                <span className="text-[#A0A0A0] text-[10px] block uppercase tracking-[0.14em]">
                  Total points
                </span>
                <span className="text-3xl text-[#FACC15] font-bold block mt-1">
                  {points?.totalPoints ?? 0}
                </span>
                <span className="text-[10px] text-[#FACC15] font-bold uppercase block mt-1 tracking-[0.14em]">
                  Level {points?.level ?? 1}
                </span>
              </div>
            </div>

            <div className="mt-8 relative z-10 font-mono text-xs">
              <div className="flex flex-col sm:flex-row justify-between text-[#D0D0D0] mb-2 font-semibold uppercase tracking-[0.14em] gap-1 sm:gap-3">
                <span>Progress to next level</span>
                <span className="text-[#FACC15] sm:text-right">
                  {points?.progressToNextLevel ?? 0} /{" "}
                  {(points?.nextLevelMin ?? 100) -
                    (points?.currentLevelMin ?? 0)}{" "}
                  pts ({progressPercentage}%)
                </span>
              </div>

              <div className="w-full bg-black/55 h-6 border border-white/10 p-1 relative">
                <div
                  className="bg-[#FACC15] h-full transition-all duration-700 ease-out flex items-center justify-end px-2"
                  style={{ width: `${progressPercentage}%` }}
                >
                  {progressPercentage > 12 && (
                    <span className="text-[9px] text-[#111111] font-black select-none tracking-[0.14em]">
                      {progressPercentage}%
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-[#9A9A9A] mt-2 uppercase tracking-[0.14em] gap-3">
                <span>Level min: {points?.currentLevelMin ?? 0}</span>
                <span className="text-right">
                  Next level: {points?.nextLevelMin ?? 100}
                </span>
              </div>
            </div>
          </section>

          <section className="border border-white/10 bg-black/45 backdrop-blur-sm overflow-hidden">
            <div className="border-b border-white/10 bg-black/45 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <Award className="text-[#FACC15] shrink-0" size={18} />
                <h3 className="font-mono text-sm text-white font-semibold uppercase tracking-[0.16em] break-words">
                  Field Badges & Achievements
                </h3>
              </div>

              <div className="flex w-full sm:w-auto border border-white/10 bg-black/40 p-1 font-mono text-xs overflow-x-auto backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setPanelTab("UNLOCKED")}
                  className={`px-4 py-1.5 transition uppercase tracking-[0.14em] font-semibold whitespace-nowrap flex-1 sm:flex-none ${
                    panelTab === "UNLOCKED"
                      ? "bg-[#22C55E] text-[#111111]"
                      : "text-[#A0A0A0] hover:text-[#22C55E]"
                  }`}
                >
                  Unlocked ({unlocked?.total ?? 0})
                </button>

                <button
                  type="button"
                  onClick={() => setPanelTab("PENDING")}
                  className={`px-4 py-1.5 transition uppercase tracking-[0.14em] font-semibold whitespace-nowrap flex-1 sm:flex-none ${
                    panelTab === "PENDING"
                      ? "bg-[#E85D04] text-[#111111]"
                      : "text-[#A0A0A0] hover:text-[#E85D04]"
                  }`}
                >
                  Pending ({pending?.total ?? 0})
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 space-y-4 font-mono bg-transparent">
              {loading && (
                <div className="border border-white/10 bg-black/50 backdrop-blur-sm p-4 text-[12px] text-[#9A9A9A] uppercase tracking-[0.14em]">
                  Loading achievements...
                </div>
              )}

              {!loading &&
                panelTab === "UNLOCKED" &&
                unlockedItems.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-xs text-[#9A9A9A] uppercase tracking-[0.14em]">
                      No unlocked achievements.
                    </p>
                  </div>
                )}

              {!loading &&
                panelTab === "UNLOCKED" &&
                unlockedItems.map((achievement) => (
                  <UnlockedAchievementCard
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}

              {!loading &&
                panelTab === "PENDING" &&
                pendingItems.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-xs text-[#9A9A9A] uppercase tracking-[0.14em]">
                      No pending achievements.
                    </p>
                  </div>
                )}

              {!loading &&
                panelTab === "PENDING" &&
                pendingItems.map((achievement) => (
                  <PendingAchievementCard
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
            </div>

            {panelTab === "UNLOCKED" && (
              <div className="p-3.5 bg-black/45 backdrop-blur-sm border-t border-[#22C55E]/20 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 font-mono text-xs">
                <span className="text-[10px] text-[#9A9A9A] uppercase tracking-[0.14em]">
                  Page {unlocked?.page ?? unlockedPage} of{" "}
                  {unlocked?.totalPages ?? 1}
                </span>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setUnlockedPage(Math.max(1, unlockedPage - 1))
                    }
                    disabled={unlockedPage <= 1}
                    className="px-3 py-1.5 text-xs border border-white/10 bg-black/40 hover:border-[#22C55E]/40 disabled:opacity-40 disabled:hover:border-white/10 text-white hover:text-[#22C55E] transition font-mono uppercase tracking-[0.14em] whitespace-nowrap"
                  >
                    <ChevronLeft size={13} className="inline mr-1" />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setUnlockedPage(
                        Math.min(unlocked?.totalPages ?? 1, unlockedPage + 1),
                      )
                    }
                    disabled={unlockedPage >= (unlocked?.totalPages ?? 1)}
                    className="px-3 py-1.5 text-xs border border-white/10 bg-black/40 hover:border-[#22C55E]/40 disabled:opacity-40 disabled:hover:border-white/10 text-white hover:text-[#22C55E] transition font-mono uppercase tracking-[0.14em] whitespace-nowrap"
                  >
                    Next
                    <ChevronRight size={13} className="inline ml-1" />
                  </button>
                </div>
              </div>
            )}

            {panelTab === "PENDING" && (
              <div className="p-3.5 bg-black/45 backdrop-blur-sm border-t border-[#E85D04]/20 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 font-mono text-xs">
                <span className="text-[10px] text-[#9A9A9A] uppercase tracking-[0.14em]">
                  Page {pending?.page ?? pendingPage} of{" "}
                  {pending?.totalPages ?? 1}
                </span>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setPendingPage(Math.max(1, pendingPage - 1))}
                    disabled={pendingPage <= 1}
                    className="px-3 py-1.5 text-xs border border-white/10 bg-black/40 hover:border-[#E85D04]/40 disabled:opacity-40 disabled:hover:border-white/10 text-white hover:text-[#E85D04] transition font-mono uppercase tracking-[0.14em] whitespace-nowrap"
                  >
                    <ChevronLeft size={13} className="inline mr-1" />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPendingPage(
                        Math.min(pending?.totalPages ?? 1, pendingPage + 1),
                      )
                    }
                    disabled={pendingPage >= (pending?.totalPages ?? 1)}
                    className="px-3 py-1.5 text-xs border border-white/10 bg-black/40 hover:border-[#E85D04]/40 disabled:opacity-40 disabled:hover:border-white/10 text-white hover:text-[#E85D04] transition font-mono uppercase tracking-[0.14em] whitespace-nowrap"
                  >
                    Next
                    <ChevronRight size={13} className="inline ml-1" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}