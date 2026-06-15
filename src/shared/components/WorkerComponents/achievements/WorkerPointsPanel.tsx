import { Trophy } from "lucide-react";

type WorkerPointsPanelProps = {
  level: number;
  totalPoints: number;
  progressToNextLevel: number;
  currentLevelMin: number;
  nextLevelMin: number;
  progressPercentage: number;
};

export function WorkerPointsPanel({
  level,
  totalPoints,
  progressToNextLevel,
  currentLevelMin,
  nextLevelMin,
  progressPercentage,
}: WorkerPointsPanelProps) {
  return (
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
            Level <span className="text-[#FACC15]">{level}</span>
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
            {totalPoints}
          </span>
          <span className="text-[10px] text-[#FACC15] font-bold uppercase block mt-1 tracking-[0.14em]">
            Level {level}
          </span>
        </div>
      </div>

      <div className="mt-8 relative z-10 font-mono text-xs">
        <div className="flex flex-col sm:flex-row justify-between text-[#D0D0D0] mb-2 font-semibold uppercase tracking-[0.14em] gap-1 sm:gap-3">
          <span>Progress to next level</span>
          <span className="text-[#FACC15] sm:text-right">
            {progressToNextLevel} / {nextLevelMin - currentLevelMin} pts (
            {progressPercentage}%)
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
          <span>Level min: {currentLevelMin}</span>
          <span className="text-right">Next level: {nextLevelMin}</span>
        </div>
      </div>
    </section>
  );
}