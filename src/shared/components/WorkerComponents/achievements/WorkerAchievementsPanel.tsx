import type { Dispatch, SetStateAction } from "react";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import type { Achievement } from "../../../../models/Achievement";
import {
  PendingAchievementCard,
  UnlockedAchievementCard,
} from "./WorkerAchievementCards";

export type AchievementTab = "UNLOCKED" | "PENDING";

type WorkerAchievementsPanelProps = {
  panelTab: AchievementTab;
  setPanelTab: Dispatch<SetStateAction<AchievementTab>>;
  loading: boolean;

  unlockedItems: Achievement[];
  pendingItems: Achievement[];

  unlockedTotal: number;
  pendingTotal: number;

  unlockedPage: number;
  pendingPage: number;

  unlockedCurrentPage: number;
  pendingCurrentPage: number;

  unlockedTotalPages: number;
  pendingTotalPages: number;

  setUnlockedPage: Dispatch<SetStateAction<number>>;
  setPendingPage: Dispatch<SetStateAction<number>>;
};

export function WorkerAchievementsPanel({
  panelTab,
  setPanelTab,
  loading,
  unlockedItems,
  pendingItems,
  unlockedTotal,
  pendingTotal,
  unlockedPage,
  pendingPage,
  unlockedCurrentPage,
  pendingCurrentPage,
  unlockedTotalPages,
  pendingTotalPages,
  setUnlockedPage,
  setPendingPage,
}: WorkerAchievementsPanelProps) {
  return (
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
            className={`px-4 py-2 border-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition-all ring-1 ${
              panelTab === "UNLOCKED"
                ? "border-[#22C55E] bg-[#22C55E]/20 text-[#22C55E] ring-[#22C55E]/40 shadow-[inset_0_0_12px_rgba(34,197,94,0.18),0_0_18px_rgba(34,197,94,0.35)]"
                : "border-[#22C55E]/45 bg-black/80 text-[#D0D0D0] ring-[#22C55E]/20 shadow-[inset_0_0_10px_rgba(34,197,94,0.10),0_0_10px_rgba(34,197,94,0.18)] hover:border-[#22C55E] hover:text-[#22C55E] hover:bg-[#22C55E]/12 hover:ring-[#22C55E]/45 hover:shadow-[inset_0_0_14px_rgba(34,197,94,0.18),0_0_22px_rgba(34,197,94,0.45)]"
            }`}
          >
            Unlocked ({unlockedTotal})
          </button>

          <button
            type="button"
            onClick={() => setPanelTab("PENDING")}
            className={`px-4 py-2 border-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition-all ring-1 ${
              panelTab === "PENDING"
                ? "border-[#FACC15] bg-[#FACC15]/20 text-[#FACC15] ring-[#FACC15]/40 shadow-[inset_0_0_12px_rgba(250,204,21,0.18),0_0_18px_rgba(250,204,21,0.35)]"
                : "border-[#FACC15]/45 bg-black/80 text-[#D0D0D0] ring-[#FACC15]/20 shadow-[inset_0_0_10px_rgba(250,204,21,0.10),0_0_10px_rgba(250,204,21,0.18)] hover:border-[#FACC15] hover:text-[#FACC15] hover:bg-[#FACC15]/12 hover:ring-[#FACC15]/45 hover:shadow-[inset_0_0_14px_rgba(250,204,21,0.18),0_0_22px_rgba(250,204,21,0.45)]"
            }`}
          >
            Pending ({pendingTotal})
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-4 font-mono bg-transparent">
        {loading && (
          <div className="border border-white/10 bg-black/50 backdrop-blur-sm p-4 text-[12px] text-[#9A9A9A] uppercase tracking-[0.14em]">
            Loading achievements...
          </div>
        )}

        {!loading && panelTab === "UNLOCKED" && unlockedItems.length === 0 && (
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

        {!loading && panelTab === "PENDING" && pendingItems.length === 0 && (
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
            Page {unlockedCurrentPage} of {unlockedTotalPages}
          </span>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setUnlockedPage(Math.max(1, unlockedPage - 1))}
              disabled={unlockedPage <= 1}
              className="px-3 py-1.5 text-xs border-2 border-[#38BDF8]/55 bg-black/80 text-white ring-1 ring-[#38BDF8]/25 shadow-[inset_0_0_10px_rgba(56,189,248,0.10),0_0_12px_rgba(56,189,248,0.22)] hover:text-[#38BDF8] hover:border-[#38BDF8] hover:bg-[#38BDF8]/12 hover:ring-[#38BDF8]/45 hover:shadow-[inset_0_0_14px_rgba(56,189,248,0.18),0_0_22px_rgba(56,189,248,0.45)] disabled:opacity-40 disabled:hover:border-[#38BDF8]/55 disabled:hover:text-white disabled:hover:bg-black/80 disabled:hover:ring-[#38BDF8]/25 disabled:hover:shadow-[inset_0_0_10px_rgba(56,189,248,0.10),0_0_12px_rgba(56,189,248,0.22)] transition-all font-mono uppercase flex items-center gap-1 whitespace-nowrap tracking-[0.14em]"
            >
              <ChevronLeft size={13} className="inline mr-1" />
              Previous
            </button>

            <button
              type="button"
              onClick={() =>
                setUnlockedPage(Math.min(unlockedTotalPages, unlockedPage + 1))
              }
              disabled={unlockedPage >= unlockedTotalPages}
              className="px-3 py-1.5 text-xs border-2 border-[#22C55E]/50 bg-black/70 text-white ring-1 ring-[#22C55E]/20 shadow-[inset_0_0_10px_rgba(34,197,94,0.10),0_0_12px_rgba(34,197,94,0.22)] hover:text-[#22C55E] hover:border-[#22C55E] hover:bg-[#22C55E]/10 hover:ring-[#22C55E]/40 hover:shadow-[inset_0_0_14px_rgba(34,197,94,0.18),0_0_22px_rgba(34,197,94,0.45)] disabled:opacity-40 disabled:hover:border-[#22C55E]/50 disabled:hover:text-white disabled:hover:bg-black/70 disabled:hover:shadow-none transition-all font-mono uppercase flex items-center gap-1 whitespace-nowrap tracking-[0.14em]"
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
            Page {pendingCurrentPage} of {pendingTotalPages}
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
                setPendingPage(Math.min(pendingTotalPages, pendingPage + 1))
              }
              disabled={pendingPage >= pendingTotalPages}
              className="px-3 py-1.5 text-xs border border-white/10 bg-black/40 hover:border-[#E85D04]/40 disabled:opacity-40 disabled:hover:border-white/10 text-white hover:text-[#E85D04] transition font-mono uppercase tracking-[0.14em] whitespace-nowrap"
            >
              Next
              <ChevronRight size={13} className="inline ml-1" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
