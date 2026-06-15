import { AlertTriangle, RefreshCw } from "lucide-react";
import { useWorkerProfile } from "../hooks/useWorkerProfile";
import { WorkerProfileCampCard } from "../components/WorkerComponents/WorkerProfileCampCard";
import { WorkerProfileHealthCard } from "../components/WorkerComponents/WorkerProfileHealthCard";
import { WorkerProfileIdentityCard } from "../components/WorkerComponents/WorkerProfileIdentityCard";
import { WorkerProfileProfessionCard } from "../components/WorkerComponents/WorkerProfileProfessionCard";

export function WorkerProfileView() {
  const { profile, loading, error, reload } = useWorkerProfile();

  const baseProfession = profile?.profession?.base ?? null;
  const temporaryProfession = profile?.profession?.temporary ?? null;

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden min-w-0">
      <div className="w-full bg-black/60 backdrop-blur-sm border-b border-white/10 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-mono font-bold text-white uppercase tracking-[0.18em] break-words">
            Worker Registry
          </span>
          <span className="text-[10px] font-mono text-[#9A9A9A] uppercase tracking-[0.14em] break-words">
            Personal profile / camp assignment / profession status
          </span>
        </div>

        <button
          type="button"
          onClick={() => void reload()}
          className="flex items-center gap-2 border border-white/10 bg-black/60 backdrop-blur-sm px-3 py-1.5 text-[10px] font-mono text-[#C0C0C0] hover:text-[#E85D04] hover:border-[#E85D04]/40 uppercase tracking-[0.14em] transition-colors shrink-0"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-transparent">
        <div className="p-3 sm:p-4 flex flex-col gap-4">
          {error && (
            <div className="border border-[#E85D04]/50 bg-black/70 backdrop-blur-sm text-[#E85D04] px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] flex items-start sm:items-center gap-2 break-words">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 sm:mt-0" />
              {error}
            </div>
          )}

          {loading && (
            <div className="border border-white/10 bg-black/70 backdrop-blur-sm p-6 font-mono text-xs text-[#9A9A9A] uppercase tracking-[0.14em]">
              Loading worker profile...
            </div>
          )}

          {!loading && !profile && !error && (
            <div className="border border-white/10 bg-black/70 backdrop-blur-sm p-6 font-mono text-xs text-[#9A9A9A] uppercase tracking-[0.14em]">
              No worker profile data available.
            </div>
          )}

          {!loading && profile && (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-4">
                <WorkerProfileIdentityCard profile={profile} />

                <WorkerProfileHealthCard conditions={profile.conditions} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <WorkerProfileCampCard camp={profile.camp} />

                <WorkerProfileProfessionCard
                  type="base"
                  profession={baseProfession}
                />

                <WorkerProfileProfessionCard
                  type="temporary"
                  profession={temporaryProfession}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}