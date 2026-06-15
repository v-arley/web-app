import { ChevronLeft, ChevronRight } from "lucide-react";

type WorkerExplorationsPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  setPage: (value: number) => void;
};

export function WorkerExplorationsPagination({
  page,
  totalPages,
  total,
  setPage,
}: WorkerExplorationsPaginationProps) {
  const safeTotalPages = totalPages || 1;

  return (
    <section className="p-4 border border-white/10 bg-black/65 backdrop-blur-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 font-mono text-xs">
      <span className="text-[10px] text-[#9A9A9A] uppercase tracking-[0.14em]">
        Page {page} of {safeTotalPages} // Total: {total}
      </span>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1.5 text-xs border-2 border-[#38BDF8]/55 bg-black/80 text-white ring-1 ring-[#38BDF8]/25 shadow-[inset_0_0_10px_rgba(56,189,248,0.10),0_0_12px_rgba(56,189,248,0.22)] hover:text-[#38BDF8] hover:border-[#38BDF8] hover:bg-[#38BDF8]/12 hover:ring-[#38BDF8]/45 hover:shadow-[inset_0_0_14px_rgba(56,189,248,0.18),0_0_22px_rgba(56,189,248,0.45)] disabled:opacity-40 disabled:hover:border-[#38BDF8]/55 disabled:hover:text-white disabled:hover:bg-black/80 disabled:hover:ring-[#38BDF8]/25 disabled:hover:shadow-[inset_0_0_10px_rgba(56,189,248,0.10),0_0_12px_rgba(56,189,248,0.22)] transition-all font-mono uppercase flex items-center gap-1 whitespace-nowrap tracking-[0.14em]"
        >
          <ChevronLeft size={13} />
          Previous
        </button>

        <button
          type="button"
          onClick={() => setPage(Math.min(safeTotalPages, page + 1))}
          disabled={page >= safeTotalPages}
          className="px-3 py-1.5 text-xs border-2 border-[#22C55E]/55 bg-black/80 text-white ring-1 ring-[#22C55E]/25 shadow-[inset_0_0_10px_rgba(34,197,94,0.10),0_0_12px_rgba(34,197,94,0.22)] hover:text-[#22C55E] hover:border-[#22C55E] hover:bg-[#22C55E]/12 hover:ring-[#22C55E]/45 hover:shadow-[inset_0_0_14px_rgba(34,197,94,0.18),0_0_22px_rgba(34,197,94,0.45)] disabled:opacity-40 disabled:hover:border-[#22C55E]/55 disabled:hover:text-white disabled:hover:bg-black/80 disabled:hover:ring-[#22C55E]/25 disabled:hover:shadow-[inset_0_0_10px_rgba(34,197,94,0.10),0_0_12px_rgba(34,197,94,0.22)] transition-all font-mono uppercase flex items-center gap-1 whitespace-nowrap tracking-[0.14em]"
        >
          Next
          <ChevronRight size={13} />
        </button>
      </div>
    </section>
  );
}
