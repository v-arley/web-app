import { User } from "lucide-react";
import { getSexLabel, getStateClass, getStateLabel } from "./workerProfileUtils";

type WorkerProfileIdentityCardProps = {
  profile: {
    name?: string | null;
    surname?: string | null;
    last_name?: string | null;
    dni?: string | null;
    sex?: string | null;
    state?: string | null;
    photo?: string | null;
    description?: string | null;
  };
};

export function WorkerProfileIdentityCard({
  profile,
}: WorkerProfileIdentityCardProps) {
  const fullName =
    `${profile.name ?? ""} ${profile.surname ?? profile.last_name ?? ""}`.trim() ||
    "Worker profile";

  return (
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
  );
}