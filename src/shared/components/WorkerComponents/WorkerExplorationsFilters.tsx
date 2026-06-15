import { Search, X } from "lucide-react";

type WorkerExplorationsFiltersProps = {
  name: string;
  setName: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  riskLevel: string;
  setRiskLevel: (value: string) => void;
  clearFilters: () => void;
};

export function WorkerExplorationsFilters({
  name,
  setName,
  state,
  setState,
  riskLevel,
  setRiskLevel,
  clearFilters,
}: WorkerExplorationsFiltersProps) {
  return (
    <section className="border border-white/10 bg-black/65 backdrop-blur-sm p-4 font-mono text-xs">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 min-w-0">
          <label className="text-[#9A9A9A] block mb-1 uppercase text-[9px] tracking-[0.14em]">
            Search exploration
          </label>

          <div className="relative">
            <input
              type="text"
              placeholder="Exploration name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full bg-black/70 border border-white/10 focus:border-[#E85D04]/70 p-3 pl-9 outline-none text-white text-xs placeholder:text-[#7C7C7C]"
            />

            <Search
              size={15}
              className="absolute left-3 top-3 text-[#7C7C7C]"
            />
          </div>
        </div>

        <div className="min-w-0">
          <label className="text-[#9A9A9A] block mb-1 uppercase text-[9px] tracking-[0.14em]">
            State
          </label>

          <select
            value={state}
            onChange={(event) => setState(event.target.value)}
            className="w-full bg-black/70 border border-white/10 focus:border-[#E85D04]/70 p-3 outline-none text-white text-xs"
          >
            <option value="">All</option>
            <option value="P">Pending</option>
            <option value="A">Active</option>
            <option value="F">Finished</option>
            <option value="C">Cancelled</option>
          </select>
        </div>

        <div className="min-w-0">
          <label className="text-[#9A9A9A] block mb-1 uppercase text-[9px] tracking-[0.14em]">
            Risk
          </label>

          <select
            value={riskLevel}
            onChange={(event) => setRiskLevel(event.target.value)}
            className="w-full bg-black/70 border border-white/10 focus:border-[#E85D04]/70 p-3 outline-none text-white text-xs"
          >
            <option value="">All</option>
            <option value="L">Low</option>
            <option value="M">Medium</option>
            <option value="H">High</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={clearFilters}
          className="w-full sm:w-auto px-3 py-2 border border-white/10 bg-black/60 text-[#C0C0C0] hover:border-[#E85D04]/50 hover:text-[#E85D04] uppercase tracking-[0.14em] transition-colors"
        >
          <X size={13} className="inline mr-1" />
          Clear filters
        </button>
      </div>
    </section>
  );
}