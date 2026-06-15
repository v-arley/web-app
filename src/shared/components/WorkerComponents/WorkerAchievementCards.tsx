import { Calendar, Lock, Unlock } from "lucide-react";
import type { Achievement } from "../../../models/Achievement";
import { formatDate, getProgressPercent } from "./workerAchievementUtils";

export function UnlockedAchievementCard({
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

export function PendingAchievementCard({ achievement }: { achievement: Achievement }) {
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