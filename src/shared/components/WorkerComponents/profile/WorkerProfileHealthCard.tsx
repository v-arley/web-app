import { HeartPulse } from "lucide-react";

type WorkerProfileHealthCardProps = {
  conditions?: string | null;
};

export function WorkerProfileHealthCard({
  conditions,
}: WorkerProfileHealthCardProps) {
  return (
    <section className="border border-[#E85D04]/35 bg-black/65 backdrop-blur-sm p-4 sm:p-5 min-w-0">
      <div className="flex items-center gap-2 border-b border-white/25 pb-3 mb-4">
        <HeartPulse size={17} className="text-[#E85D04] shrink-0" />
        <h2 className="text-[13px] font-mono text-white font-bold uppercase tracking-[0.14em] break-words">
          Health conditions
        </h2>
      </div>

      <div className="bg-black/70 border border-white/20 p-4 min-h-28 hover:border-[#E85D04]/50 transition-colors">
        <p className="text-[13px] text-[#D0D0D0] font-mono leading-relaxed break-words">
          {conditions || "No health conditions registered."}
        </p>
      </div>
    </section>
  );
}