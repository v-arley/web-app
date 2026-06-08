import {
  AlertTriangle,
  BadgeCheck,
  Briefcase,
  Calendar,
  HeartPulse,
  MapPin,
  RefreshCw,
  User,
} from "lucide-react";
import { useWorkerProfile } from "../hooks/useWorkerProfile";

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

function getSexLabel(sex?: string) {
  if (sex === "M") return "Male";
  if (sex === "F") return "Female";
  if (sex === "O") return "Other";
  return "N/A";
}

function getStateLabel(state?: string) {
  if (state === "A") return "Active";
  if (state === "I") return "Inactive";
  return "Unknown";
}

function getStateClass(state?: string) {
  if (state === "A") {
    return "text-[#F59E0B] border-[#F59E0B]/60 bg-black/60";
  }

  if (state === "I") {
    return "text-[#9A9A9A] border-white/10 bg-black/60";
  }

  return "text-[#9A9A9A] border-white/10 bg-black/60";
}

export function WorkerProfileView() {
  const { profile, loading, error, reload } = useWorkerProfile();

  const fullName = profile
    ? `${profile.name ?? ""} ${profile.surname ?? profile.last_name ?? ""}`.trim()
    : "Worker profile";

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
                <section className="border border-[#E85D04]/35 bg-black/65 backdrop-blur-sm p-4 sm:p-5 min-w-0">
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="shrink-0 flex flex-col items-center gap-3">
                      <div className="relative w-32 h-32 sm:w-36 sm:h-36 border-2 border-[#E85D04]/70 bg-black/70 overflow-hidden flex items-center justify-center">
                        <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-[#E85D04]" />
                        <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-[#E85D04]" />
                        <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-[#E85D04]" />
                        <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[#E85D04]" />

                        {profile.photo ? (
                          <img
                            src={profile.photo}
                            alt={fullName}
                            className="w-full h-full object-cover grayscale"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <User size={50} className="text-[#E85D04]" />
                            <span className="text-[9px] font-mono text-[#9A9A9A] uppercase tracking-[0.14em]">
                              No photo
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 bg-[#E85D04] text-[#111111] text-[10px] font-mono font-black text-center uppercase tracking-[0.14em] py-1">
                          {getStateLabel(profile.state)}
                        </div>
                      </div>

                      <div
                        className={`border px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.14em] ${getStateClass(profile.state)}`}
                      >
                        {getStateLabel(profile.state)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="border-b border-white/25 pb-3 mb-4">
                        <span className="text-[10px] text-[#E85D04] font-mono uppercase tracking-[0.14em]">
                          Identity file
                        </span>
                        <h1 className="text-[22px] sm:text-[26px] text-white font-mono font-bold uppercase tracking-wide leading-tight break-words">
                          {fullName}
                        </h1>
                        <p className="text-[12px] text-[#D0D0D0] font-mono mt-1 break-words">
                          DNI:{" "}
                          <span className="text-[#E85D04] font-bold break-all">
                            {profile.dni ?? "N/A"}
                          </span>
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="border border-white/20 bg-black/70 p-3 hover:border-[#E85D04]/50 transition-colors min-w-0">
                          <span className="block text-[10px] text-[#9A9A9A] font-mono uppercase tracking-[0.14em] mb-1">
                            Sex
                          </span>
                          <span className="text-[13px] text-white font-mono break-words">
                            {getSexLabel(profile.sex)}
                          </span>
                        </div>

                        <div className="border border-white/20 bg-black/70 p-3 hover:border-[#F59E0B]/50 transition-colors min-w-0">
                          <span className="block text-[10px] text-[#9A9A9A] font-mono uppercase tracking-[0.14em] mb-1">
                            State
                          </span>
                          <span className="text-[13px] text-[#F59E0B] font-mono font-bold break-words">
                            {getStateLabel(profile.state)}
                          </span>
                        </div>
                      </div>

                      <div className="border border-white/20 bg-black/70 p-4 hover:border-[#E85D04]/50 transition-colors min-w-0">
                        <span className="block text-[10px] text-[#9A9A9A] font-mono uppercase tracking-[0.14em] mb-2">
                          Background description
                        </span>
                        <p className="text-[13px] text-[#D0D0D0] font-mono leading-relaxed break-words">
                          {profile.description || "No description registered."}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="border border-[#E85D04]/35 bg-black/65 backdrop-blur-sm p-4 sm:p-5 min-w-0">
                  <div className="flex items-center gap-2 border-b border-white/25 pb-3 mb-4">
                    <HeartPulse size={17} className="text-[#E85D04] shrink-0" />
                    <h2 className="text-[13px] font-mono text-white font-bold uppercase tracking-[0.14em] break-words">
                      Health conditions
                    </h2>
                  </div>

                  <div className="bg-black/70 border border-white/20 p-4 min-h-28 hover:border-[#E85D04]/50 transition-colors">
                    <p className="text-[13px] text-[#D0D0D0] font-mono leading-relaxed break-words">
                      {profile.conditions || "No health conditions registered."}
                    </p>
                  </div>
                </section>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <section className="border border-[#E85D04]/35 bg-black/65 backdrop-blur-sm p-4 sm:p-5 min-w-0">
                  <div className="flex items-center gap-2 border-b border-white/25 pb-3 mb-4">
                    <MapPin size={16} className="text-[#E85D04] shrink-0" />
                    <h2 className="text-[13px] font-mono text-white font-bold uppercase tracking-[0.14em] break-words">
                      Assigned camp
                    </h2>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between gap-4 border-b border-white/25 pb-2">
                      <span className="text-[#9A9A9A] uppercase shrink-0">
                        Code
                      </span>
                      <span className="text-[#E85D04] text-right font-bold break-all">
                        {profile.camp?.code ?? "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[#9A9A9A] uppercase mb-2">
                        Description
                      </span>
                      <p className="text-[#D0D0D0] leading-relaxed break-words">
                        {profile.camp?.description ??
                          "No camp description available."}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="border border-[#E85D04]/35 bg-black/65 backdrop-blur-sm p-4 sm:p-5 min-w-0">
                  <div className="flex items-start sm:items-center justify-between gap-3 border-b border-white/25 pb-3 mb-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <Briefcase size={16} className="text-[#E85D04] shrink-0" />
                      <h2 className="text-[13px] font-mono text-white font-bold uppercase tracking-[0.14em] break-words">
                        Base profession
                      </h2>
                    </div>
                    <span className="border border-[#E85D04]/60 text-[#E85D04] bg-black/60 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.14em] shrink-0">
                      Base
                    </span>
                  </div>

                  {baseProfession ? (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between gap-4 border-b border-white/25 pb-2">
                        <span className="text-[#9A9A9A] uppercase shrink-0">
                          Name
                        </span>
                        <span className="text-white text-right font-bold break-words">
                          {baseProfession.name}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 border-b border-white/25 pb-2">
                        <span className="text-[#9A9A9A] uppercase shrink-0">
                          Code
                        </span>
                        <span className="text-[#E85D04] text-right font-bold break-all">
                          {baseProfession.code}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-[#9A9A9A] uppercase shrink-0">
                          Assigned
                        </span>
                        <span className="text-[#D0D0D0] text-right flex items-center justify-end gap-1 break-words">
                          <Calendar size={12} className="text-[#E85D04] shrink-0" />
                          {formatDate(baseProfession.assignedAt)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-white/25 bg-black/70 p-4 text-[12px] font-mono text-[#9A9A9A] uppercase tracking-[0.14em]">
                      No base profession assigned.
                    </div>
                  )}
                </section>

                <section className="border border-[#38BDF8]/35 bg-black/65 backdrop-blur-sm p-4 sm:p-5 min-w-0">
                  <div className="flex items-start sm:items-center justify-between gap-3 border-b border-white/25 pb-3 mb-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <BadgeCheck size={16} className="text-[#38BDF8] shrink-0" />
                      <h2 className="text-[13px] font-mono text-white font-bold uppercase tracking-[0.14em] break-words">
                        Temporary assignment
                      </h2>
                    </div>

                    {temporaryProfession ? (
                      <span className="border border-[#38BDF8]/60 text-[#38BDF8] bg-black/60 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.14em] shrink-0">
                        Active
                      </span>
                    ) : (
                      <span className="border border-white/20 text-[#9A9A9A] bg-black/60 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.14em] shrink-0">
                        None
                      </span>
                    )}
                  </div>

                  {temporaryProfession ? (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between gap-4 border-b border-white/25 pb-2">
                        <span className="text-[#9A9A9A] uppercase shrink-0">
                          Name
                        </span>
                        <span className="text-white text-right font-bold break-words">
                          {temporaryProfession.name}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 border-b border-white/25 pb-2">
                        <span className="text-[#9A9A9A] uppercase shrink-0">
                          Code
                        </span>
                        <span className="text-[#38BDF8] text-right font-bold break-all">
                          {temporaryProfession.code}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 border-b border-white/25 pb-2">
                        <span className="text-[#9A9A9A] uppercase shrink-0">
                          Assigned
                        </span>
                        <span className="text-[#D0D0D0] text-right break-words">
                          {formatDate(temporaryProfession.assignedAt)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-[#9A9A9A] uppercase shrink-0">
                          Until
                        </span>
                        <span className="text-[#FACC15] text-right font-bold break-words">
                          {formatDate(temporaryProfession.temporaryUntil)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-white/20 bg-black/70 p-4 text-[12px] font-mono text-[#9A9A9A] uppercase tracking-[0.14em]">
                      No active temporary profession detected.
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}