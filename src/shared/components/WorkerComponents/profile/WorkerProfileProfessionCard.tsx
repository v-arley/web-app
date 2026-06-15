import { BadgeCheck, Briefcase, Calendar } from "lucide-react";
import { formatDate } from "./workerProfileUtils";

type WorkerProfession = {
  name?: string | null;
  code?: string | null;
  assignedAt?: Date | string | null;
  temporaryUntil?: Date | string | null;
};

type WorkerProfileProfessionCardProps = {
  type: "base" | "temporary";
  profession?: WorkerProfession | null;
};

export function WorkerProfileProfessionCard({
  type,
  profession,
}: WorkerProfileProfessionCardProps) {
  const isBase = type === "base";

  return (
    <section
      className={`border ${
        isBase ? "border-[#E85D04]/35" : "border-[#38BDF8]/35"
      } bg-black/65 backdrop-blur-sm p-4 sm:p-5 min-w-0`}
    >
      <div className="flex items-start sm:items-center justify-between gap-3 border-b border-white/25 pb-3 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          {isBase ? (
            <Briefcase size={16} className="text-[#E85D04] shrink-0" />
          ) : (
            <BadgeCheck size={16} className="text-[#38BDF8] shrink-0" />
          )}

          <h2 className="text-[13px] font-mono text-white font-bold uppercase tracking-[0.14em] break-words">
            {isBase ? "Base profession" : "Temporary assignment"}
          </h2>
        </div>

        {isBase ? (
          <span className="border border-[#E85D04]/60 text-[#E85D04] bg-black/60 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.14em] shrink-0">
            Base
          </span>
        ) : profession ? (
          <span className="border border-[#38BDF8]/60 text-[#38BDF8] bg-black/60 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.14em] shrink-0">
            Active
          </span>
        ) : (
          <span className="border border-white/20 text-[#9A9A9A] bg-black/60 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.14em] shrink-0">
            None
          </span>
        )}
      </div>

      {profession ? (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between gap-4 border-b border-white/25 pb-2">
            <span className="text-[#9A9A9A] uppercase shrink-0">Name</span>
            <span className="text-white text-right font-bold break-words">
              {profession.name}
            </span>
          </div>

          <div className="flex justify-between gap-4 border-b border-white/25 pb-2">
            <span className="text-[#9A9A9A] uppercase shrink-0">Code</span>
            <span
              className={`${
                isBase ? "text-[#E85D04]" : "text-[#38BDF8]"
              } text-right font-bold break-all`}
            >
              {profession.code}
            </span>
          </div>

          <div
            className={`flex justify-between gap-4 ${
              isBase ? "" : "border-b border-white/25 pb-2"
            }`}
          >
            <span className="text-[#9A9A9A] uppercase shrink-0">
              Assigned
            </span>

            {isBase ? (
              <span className="text-[#D0D0D0] text-right flex items-center justify-end gap-1 break-words">
                <Calendar size={12} className="text-[#E85D04] shrink-0" />
                {formatDate(profession.assignedAt)}
              </span>
            ) : (
              <span className="text-[#D0D0D0] text-right break-words">
                {formatDate(profession.assignedAt)}
              </span>
            )}
          </div>

          {!isBase && (
            <div className="flex justify-between gap-4">
              <span className="text-[#9A9A9A] uppercase shrink-0">Until</span>
              <span className="text-[#FACC15] text-right font-bold break-words">
                {formatDate(profession.temporaryUntil)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border ${
            isBase ? "border-white/25" : "border-white/20"
          } bg-black/70 p-4 text-[12px] font-mono text-[#9A9A9A] uppercase tracking-[0.14em]`}
        >
          {isBase
            ? "No base profession assigned."
            : "No active temporary profession detected."}
        </div>
      )}
    </section>
  );
}