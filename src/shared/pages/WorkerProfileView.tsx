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
    return "text-[#F59E0B] border-[#F59E0B] bg-[#F59E0B]/10 shadow-[0_0_10px_rgba(245,158,11,0.25)]";
  }

  if (state === "I") {
    return "text-[#6B7280] border-[#6B7280] bg-[#6B7280]/10";
  }

  return "text-[#6B7280] border-[#3a3a3a] bg-[#2e2e2e]";
}

export function WorkerProfileView() {
  const { profile, loading, error, reload } = useWorkerProfile();

  const fullName = profile
    ? `${profile.name ?? ""} ${profile.surname ?? profile.last_name ?? ""}`.trim()
    : "Worker profile";

  const baseProfession = profile?.profession?.base ?? null;
  const temporaryProfession = profile?.profession?.temporary ?? null;

  return (
    <div className="w-full h-full flex flex-col bg-[#111111] overflow-hidden">
      <div className="w-full bg-[#242424] border-b border-[#3a3a3a] px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <span className="text-[12px] font-mono font-bold text-[#C0C0C0] uppercase tracking-label">
            Worker Registry
          </span>
          <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-label">
            Personal profile / camp assignment / profession status
          </span>
        </div>

        <button
          type="button"
          onClick={() => void reload()}
          className="flex items-center gap-2 text-[11px] font-mono text-[#6B7280] hover:text-[#E85D04] uppercase tracking-label transition-colors"
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

          {loading && (
            <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-6 font-mono text-xs text-[#6B7280] uppercase tracking-label">
              Loading worker profile...
            </div>
          )}

          {!loading && !profile && !error && (
            <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-6 font-mono text-xs text-[#6B7280] uppercase tracking-label">
              No worker profile data available.
            </div>
          )}

          {!loading && profile && (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-4">
                <section className="border border-[#E85D04]/40 bg-[#1a1a1a] p-5 shadow-[0_0_18px_rgba(232,93,4,0.08)]">
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="shrink-0 flex flex-col items-center gap-3">
                      <div className="relative w-36 h-36 border-2 border-[#E85D04] bg-[#111111] overflow-hidden flex items-center justify-center shadow-[0_0_16px_rgba(232,93,4,0.22)]">
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
                            <span className="text-[9px] font-mono text-[#6B7280] uppercase tracking-label">
                              No photo
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 bg-[#E85D04] text-[#111111] text-[10px] font-mono font-black text-center uppercase tracking-label py-1">
                          {getStateLabel(profile.state)}
                        </div>
                      </div>

                      <div
                        className={`border px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-label ${getStateClass(profile.state)}`}
                      >
                        {getStateLabel(profile.state)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="border-b border-[#3a3a3a] pb-3 mb-4">
                        <span className="text-[10px] text-[#E85D04] font-mono uppercase tracking-label">
                          Identity file
                        </span>
                        <h1 className="text-[26px] text-white font-mono font-bold uppercase tracking-wide leading-tight">
                          {fullName}
                        </h1>
                        <p className="text-[12px] text-[#C0C0C0] font-mono mt-1">
                          DNI:{" "}
                          <span className="text-[#E85D04] font-bold">
                            {profile.dni ?? "N/A"}
                          </span>
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="border border-[#3a3a3a] bg-[#111111] p-3 hover:border-[#E85D04]/50 transition-colors">
                          <span className="block text-[10px] text-[#6B7280] font-mono uppercase tracking-label mb-1">
                            Sex
                          </span>
                          <span className="text-[13px] text-white font-mono">
                            {getSexLabel(profile.sex)}
                          </span>
                        </div>

                        <div className="border border-[#3a3a3a] bg-[#111111] p-3 hover:border-[#F59E0B]/50 transition-colors">
                          <span className="block text-[10px] text-[#6B7280] font-mono uppercase tracking-label mb-1">
                            State
                          </span>
                          <span className="text-[13px] text-[#F59E0B] font-mono font-bold">
                            {getStateLabel(profile.state)}
                          </span>
                        </div>
                      </div>

                      <div className="border border-[#3a3a3a] bg-[#111111] p-4 hover:border-[#E85D04]/50 transition-colors">
                        <span className="block text-[10px] text-[#6B7280] font-mono uppercase tracking-label mb-2">
                          Background description
                        </span>
                        <p className="text-[13px] text-[#C0C0C0] font-mono leading-relaxed">
                          {profile.description || "No description registered."}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="border border-[#E85D04]/40 bg-[#1a1a1a] p-5 shadow-[0_0_18px_rgba(232,93,4,0.08)]">
                  <div className="flex items-center gap-2 border-b border-[#3a3a3a] pb-3 mb-4">
                    <HeartPulse size={17} className="text-[#E85D04]" />
                    <h2 className="text-[13px] font-mono text-white font-bold uppercase tracking-label">
                      Health conditions
                    </h2>
                  </div>

                  <div className="bg-[#111111] border border-[#3a3a3a] p-4 min-h-28 hover:border-[#E85D04]/50 transition-colors">
                    <p className="text-[13px] text-[#C0C0C0] font-mono leading-relaxed">
                      {profile.conditions || "No health conditions registered."}
                    </p>
                  </div>
                </section>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <section className="border border-[#E85D04]/40 bg-[#1a1a1a] p-5 shadow-[0_0_18px_rgba(232,93,4,0.08)]">
                  <div className="flex items-center gap-2 border-b border-[#3a3a3a] pb-3 mb-4">
                    <MapPin size={16} className="text-[#E85D04]" />
                    <h2 className="text-[13px] font-mono text-white font-bold uppercase tracking-label">
                      Assigned camp
                    </h2>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between gap-4 border-b border-[#3a3a3a] pb-2">
                      <span className="text-[#6B7280] uppercase">Code</span>
                      <span className="text-[#E85D04] text-right font-bold">
                        {profile.camp?.code ?? "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[#6B7280] uppercase mb-2">
                        Description
                      </span>
                      <p className="text-[#C0C0C0] leading-relaxed">
                        {profile.camp?.description ??
                          "No camp description available."}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="border border-[#E85D04]/40 bg-[#1a1a1a] p-5 shadow-[0_0_18px_rgba(232,93,4,0.08)]">
                  <div className="flex items-center justify-between border-b border-[#3a3a3a] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-[#E85D04]" />
                      <h2 className="text-[13px] font-mono text-white font-bold uppercase tracking-label">
                        Base profession
                      </h2>
                    </div>
                    <span className="border border-[#E85D04] text-[#E85D04] bg-[#E85D04]/10 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-label shadow-[0_0_10px_rgba(232,93,4,0.18)]">
                      Base
                    </span>
                  </div>

                  {baseProfession ? (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between gap-4 border-b border-[#3a3a3a] pb-2">
                        <span className="text-[#6B7280] uppercase">Name</span>
                        <span className="text-white text-right font-bold">
                          {baseProfession.name}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 border-b border-[#3a3a3a] pb-2">
                        <span className="text-[#6B7280] uppercase">Code</span>
                        <span className="text-[#E85D04] text-right font-bold">
                          {baseProfession.code}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-[#6B7280] uppercase">
                          Assigned
                        </span>
                        <span className="text-[#C0C0C0] text-right flex items-center gap-1">
                          <Calendar size={12} className="text-[#E85D04]" />
                          {formatDate(baseProfession.assignedAt)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-[#3a3a3a] bg-[#111111] p-4 text-[12px] font-mono text-[#6B7280] uppercase tracking-label">
                      No base profession assigned.
                    </div>
                  )}
                </section>

                <section className="border border-[#38BDF8]/40 bg-[#1a1a1a] p-5 shadow-[0_0_18px_rgba(56,189,248,0.08)]">
                  <div className="flex items-center justify-between border-b border-[#3a3a3a] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <BadgeCheck size={16} className="text-[#38BDF8]" />
                      <h2 className="text-[13px] font-mono text-white font-bold uppercase tracking-label">
                        Temporary assignment
                      </h2>
                    </div>

                    {temporaryProfession ? (
                      <span className="border border-[#38BDF8] text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-label shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                        Active
                      </span>
                    ) : (
                      <span className="border border-[#3a3a3a] text-[#6B7280] bg-[#2e2e2e] px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-label">
                        None
                      </span>
                    )}
                  </div>

                  {temporaryProfession ? (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between gap-4 border-b border-[#3a3a3a] pb-2">
                        <span className="text-[#6B7280] uppercase">Name</span>
                        <span className="text-white text-right font-bold">
                          {temporaryProfession.name}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 border-b border-[#3a3a3a] pb-2">
                        <span className="text-[#6B7280] uppercase">Code</span>
                        <span className="text-[#38BDF8] text-right font-bold">
                          {temporaryProfession.code}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 border-b border-[#3a3a3a] pb-2">
                        <span className="text-[#6B7280] uppercase">
                          Assigned
                        </span>
                        <span className="text-[#C0C0C0] text-right">
                          {formatDate(temporaryProfession.assignedAt)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-[#6B7280] uppercase">Until</span>
                        <span className="text-[#FACC15] text-right font-bold">
                          {formatDate(temporaryProfession.temporaryUntil)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-[#3a3a3a] bg-[#111111] p-4 text-[12px] font-mono text-[#6B7280] uppercase tracking-label">
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
