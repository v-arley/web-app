import { MapPin } from "lucide-react";

type WorkerProfileCampCardProps = {
  camp?: {
    code?: string | null;
    description?: string | null;
  } | null;
};

export function WorkerProfileCampCard({ camp }: WorkerProfileCampCardProps) {
  return (
    <section className="border border-[#E85D04]/35 bg-black/65 backdrop-blur-sm p-4 sm:p-5 min-w-0">
      <div className="flex items-center gap-2 border-b border-white/25 pb-3 mb-4">
        <MapPin size={16} className="text-[#E85D04] shrink-0" />
        <h2 className="text-[13px] font-mono text-white font-bold uppercase tracking-[0.14em] break-words">
          Assigned camp
        </h2>
      </div>

      <div className="space-y-3 font-mono text-xs">
        <div className="flex justify-between gap-4 border-b border-white/25 pb-2">
          <span className="text-[#9A9A9A] uppercase shrink-0">Code</span>
          <span className="text-[#E85D04] text-right font-bold break-all">
            {camp?.code ?? "N/A"}
          </span>
        </div>

        <div>
          <span className="block text-[#9A9A9A] uppercase mb-2">
            Description
          </span>
          <p className="text-[#D0D0D0] leading-relaxed break-words">
            {camp?.description ?? "No camp description available."}
          </p>
        </div>
      </div>
    </section>
  );
}