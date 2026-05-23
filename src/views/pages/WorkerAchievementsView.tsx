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
import { useWorkerAchievements } from "../../hooks/useWorkerAchievements";
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
    <div className="p-4 border border-[#22C55E]/60 bg-[#22C55E]/10 hover:bg-[#22C55E]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-[#22C55E]/20 border border-[#22C55E] text-[#22C55E] shrink-0 shadow-[0_0_14px_rgba(34,197,94,0.35)]">
          <Unlock size={20} />
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-white text-sm font-mono font-bold tracking-label uppercase">
              {achievement.name}
            </h4>

            <span className="bg-[#22C55E] text-[#111111] border border-[#22C55E] text-[9px] px-2 py-0.5 font-mono font-black uppercase tracking-label">
              {achievement.requiredPoints ?? achievement.points ?? 0} pts
            </span>

            <span className="border border-[#22C55E] text-[#22C55E] bg-[#22C55E]/10 text-[9px] px-2 py-0.5 font-mono font-bold uppercase tracking-label">
              Unlocked
            </span>
          </div>

          <p className="text-xs text-[#C0C0C0] font-mono leading-relaxed max-w-2xl">
            {achievement.description || "Sin descripción registrada."}
          </p>

          <span className="text-[10px] text-[#22C55E] font-mono uppercase tracking-label">
            Code: {achievement.code}
          </span>
        </div>
      </div>

      <div className="shrink-0 text-right font-mono text-xs text-[#22C55E] flex items-center gap-1 self-end sm:self-center">
        <Calendar size={14} />
        <span>Desbloqueado: {formatDate(achievement.unlockedAt)}</span>
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
    <div className="p-4 border border-[#E85D04]/55 bg-[#111111] hover:border-[#E85D04] hover:bg-[#E85D04]/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-[#E85D04]/10 border border-[#E85D04]/70 text-[#E85D04] shrink-0">
          <Lock size={20} />
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[#C0C0C0] text-sm font-mono font-bold tracking-label uppercase">
              {achievement.name}
            </h4>

            <span className="text-[9px] text-[#E85D04] border border-[#E85D04]/70 bg-[#E85D04]/10 px-2 py-0.5 font-mono uppercase tracking-label font-bold">
              Bloqueado
            </span>

            <span className="text-[9px] text-[#6B7280] border border-[#3a3a3a] px-2 py-0.5 font-mono uppercase tracking-label">
              {requiredPoints} pts
            </span>
          </div>

          <p className="text-xs text-[#9CA3AF] font-mono leading-relaxed max-w-2xl">
            {achievement.description || "Sin descripción registrada."}
          </p>

          <span className="text-[10px] text-[#E85D04] font-mono uppercase tracking-label">
            Code: {achievement.code}
          </span>
        </div>
      </div>

      <div className="shrink-0 w-full md:w-56 font-mono text-[11px] space-y-2 bg-[#1a1a1a] p-3 border border-[#E85D04]/45">
        <div className="flex justify-between text-[10px] text-[#C0C0C0] uppercase tracking-label">
          <span>Progress</span>
          <span className="text-[#E85D04] font-bold">
            {currentPoints} / {requiredPoints}
          </span>
        </div>

        <div className="w-full bg-[#111111] h-2 border border-[#3a3a3a] overflow-hidden">
          <div
            className="bg-[#E85D04] h-full shadow-[0_0_10px_rgba(232,93,4,0.55)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[10px] text-[#E85D04] block text-right uppercase tracking-label font-bold">
          Faltan {missingPoints} pts
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
    <div className="w-full h-full flex flex-col bg-[#111111] overflow-hidden">
      <div className="w-full bg-[#242424] border-b border-[#3a3a3a] px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <span className="text-[12px] font-mono font-bold text-[#C0C0C0] uppercase tracking-label">
            Logros y puntos
          </span>
          <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-label">
            Worker points / unlocked achievements / pending achievements
          </span>
        </div>

        <button
          type="button"
          onClick={() => void reload()}
          className="flex items-center gap-2 text-[11px] font-mono text-[#6B7280] hover:text-[#FACC15] uppercase tracking-label transition-colors"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 flex flex-col gap-4">
          {error && (
            <div className="border border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04] px-4 py-3 font-mono text-xs uppercase tracking-label flex items-center gap-2">
              <AlertTriangle size={15} />
              {error}
            </div>
          )}

          <section className="border border-[#FACC15]/50 bg-[#1a1a1a] p-6 relative overflow-hidden shadow-[0_0_22px_rgba(250,204,21,0.14)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a2a_1px,transparent_1px),linear-gradient(to_bottom,#2a2a2a_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#FACC15] font-mono">
                  <Trophy size={20} />
                  <span className="text-xs uppercase tracking-label font-bold">
                    Registro de puntos
                  </span>
                </div>

                <h1 className="text-3xl font-mono font-black text-white leading-none uppercase">
                  Nivel{" "}
                  <span className="text-[#FACC15] drop-shadow-[0_0_8px_rgba(250,204,21,0.45)]">
                    {points?.level ?? 1}
                  </span>
                </h1>

                <p className="text-xs text-[#C0C0C0] font-mono">
                  Progreso calculado desde el registro de puntos del trabajador.
                </p>
              </div>

              <div className="shrink-0 bg-[#111111] border border-[#FACC15]/70 p-4 text-center font-mono shadow-[0_0_18px_rgba(250,204,21,0.28)]">
                <span className="text-[#6B7280] text-[10px] block uppercase tracking-label">
                  Total points
                </span>
                <span className="text-3xl text-[#FACC15] font-bold block mt-1 drop-shadow-[0_0_10px_rgba(250,204,21,0.45)]">
                  {points?.totalPoints ?? 0}
                </span>
                <span className="text-[10px] text-[#FACC15] font-bold uppercase block mt-1 tracking-label">
                  Level {points?.level ?? 1}
                </span>
              </div>
            </div>

            <div className="mt-8 relative z-10 font-mono text-xs">
              <div className="flex justify-between text-[#C0C0C0] mb-2 font-semibold uppercase tracking-label">
                <span>Progress to next level</span>
                <span className="text-[#FACC15]">
                  {points?.progressToNextLevel ?? 0} /{" "}
                  {(points?.nextLevelMin ?? 100) -
                    (points?.currentLevelMin ?? 0)}{" "}
                  pts ({progressPercentage}%)
                </span>
              </div>

              <div className="w-full bg-[#111111] h-6 border border-[#3a3a3a] p-1 relative">
                <div
                  className="bg-[#FACC15] h-full transition-all duration-700 ease-out flex items-center justify-end px-2 shadow-[0_0_16px_rgba(250,204,21,0.75)]"
                  style={{ width: `${progressPercentage}%` }}
                >
                  {progressPercentage > 12 && (
                    <span className="text-[9px] text-[#111111] font-black select-none tracking-label">
                      {progressPercentage}%
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-[#6B7280] mt-2 uppercase tracking-label">
                <span>Level min: {points?.currentLevelMin ?? 0}</span>
                <span>Next level: {points?.nextLevelMin ?? 100}</span>
              </div>
            </div>
          </section>

          <section className="border border-[#3a3a3a] bg-[#1a1a1a] overflow-hidden shadow-[0_0_18px_rgba(0,0,0,0.35)]">
            <div className="border-b border-[#3a3a3a] bg-[#242424] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Award className="text-[#FACC15]" size={18} />
                <h3 className="font-mono text-sm text-white font-semibold uppercase tracking-label">
                  Insignias y logros de campo
                </h3>
              </div>

              <div className="flex border border-[#3a3a3a] bg-[#111111] p-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setPanelTab("UNLOCKED")}
                  className={`px-4 py-1.5 transition uppercase tracking-label font-semibold ${
                    panelTab === "UNLOCKED"
                      ? "bg-[#22C55E] text-[#111111] shadow-[0_0_12px_rgba(34,197,94,0.45)]"
                      : "text-[#6B7280] hover:text-[#22C55E]"
                  }`}
                >
                  Obtenidos ({unlocked?.total ?? 0})
                </button>

                <button
                  type="button"
                  onClick={() => setPanelTab("PENDING")}
                  className={`px-4 py-1.5 transition uppercase tracking-label font-semibold ${
                    panelTab === "PENDING"
                      ? "bg-[#E85D04] text-[#111111] shadow-[0_0_12px_rgba(232,93,4,0.45)]"
                      : "text-[#6B7280] hover:text-[#E85D04]"
                  }`}
                >
                  Pendientes ({pending?.total ?? 0})
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4 font-mono">
              {loading && (
                <div className="border border-[#3a3a3a] bg-[#111111] p-4 text-[12px] text-[#6B7280] uppercase tracking-label">
                  Loading achievements...
                </div>
              )}

              {!loading &&
                panelTab === "UNLOCKED" &&
                unlockedItems.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-xs text-[#6B7280] uppercase tracking-label">
                      No hay logros obtenidos.
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
                    <p className="text-xs text-[#6B7280] uppercase tracking-label">
                      No hay logros pendientes.
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
              <div className="p-3.5 bg-[#111111] border-t border-[#22C55E]/30 flex justify-between items-center font-mono text-xs">
                <span className="text-[10px] text-[#6B7280] uppercase tracking-label">
                  Página {unlocked?.page ?? unlockedPage} de{" "}
                  {unlocked?.totalPages ?? 1}
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setUnlockedPage(Math.max(1, unlockedPage - 1))
                    }
                    disabled={unlockedPage <= 1}
                    className="px-3 py-1.5 text-xs border border-[#3a3a3a] hover:border-[#22C55E] disabled:opacity-40 disabled:hover:border-[#3a3a3a] text-white hover:text-[#22C55E] transition font-mono uppercase tracking-label"
                  >
                    <ChevronLeft size={13} className="inline mr-1" />
                    Anterior
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setUnlockedPage(
                        Math.min(unlocked?.totalPages ?? 1, unlockedPage + 1),
                      )
                    }
                    disabled={unlockedPage >= (unlocked?.totalPages ?? 1)}
                    className="px-3 py-1.5 text-xs border border-[#3a3a3a] hover:border-[#22C55E] disabled:opacity-40 disabled:hover:border-[#3a3a3a] text-white hover:text-[#22C55E] transition font-mono uppercase tracking-label"
                  >
                    Siguiente
                    <ChevronRight size={13} className="inline ml-1" />
                  </button>
                </div>
              </div>
            )}

            {panelTab === "PENDING" && (
              <div className="p-3.5 bg-[#111111] border-t border-[#E85D04]/30 flex justify-between items-center font-mono text-xs">
                <span className="text-[10px] text-[#6B7280] uppercase tracking-label">
                  Página {pending?.page ?? pendingPage} de{" "}
                  {pending?.totalPages ?? 1}
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPendingPage(Math.max(1, pendingPage - 1))}
                    disabled={pendingPage <= 1}
                    className="px-3 py-1.5 text-xs border border-[#3a3a3a] hover:border-[#E85D04] disabled:opacity-40 disabled:hover:border-[#3a3a3a] text-white hover:text-[#E85D04] transition font-mono uppercase tracking-label"
                  >
                    <ChevronLeft size={13} className="inline mr-1" />
                    Anterior
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPendingPage(
                        Math.min(pending?.totalPages ?? 1, pendingPage + 1),
                      )
                    }
                    disabled={pendingPage >= (pending?.totalPages ?? 1)}
                    className="px-3 py-1.5 text-xs border border-[#3a3a3a] hover:border-[#E85D04] disabled:opacity-40 disabled:hover:border-[#3a3a3a] text-white hover:text-[#E85D04] transition font-mono uppercase tracking-label"
                  >
                    Siguiente
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
