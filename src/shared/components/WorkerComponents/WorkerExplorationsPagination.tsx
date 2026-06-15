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
          className="px-3 py-1.5 text-xs border border-white/10 bg-black/60 hover:border-[#E85D04]/50 disabled:opacity-40 disabled:hover:border-white/10 text-white hover:text-[#E85D04] transition-colors font-mono uppercase flex items-center gap-1 whitespace-nowrap tracking-[0.14em]"
        >
          <ChevronLeft size={13} />
          Previous
        </button>

        <button
          type="button"
          onClick={() => setPage(Math.min(safeTotalPages, page + 1))}
          disabled={page >= safeTotalPages}
          className="px-3 py-1.5 text-xs border border-white/10 bg-black/60 hover:border-[#E85D04]/50 disabled:opacity-40 disabled:hover:border-white/10 text-white hover:text-[#E85D04] transition-colors font-mono uppercase flex items-center gap-1 whitespace-nowrap tracking-[0.14em]"
        >
          Next
          <ChevronRight size={13} />
        </button>
      </div>
    </section>
  );
}