import { Plus, Search } from "lucide-react";

import type {
    RiskFilter,
    StateFilter,
} from "./explorationHelpers";

type Props = {
    search: string;
    riskFilter: RiskFilter;
    stateFilter: StateFilter;
    onSearchChange: (value: string) => void;
    onRiskFilterChange: (value: RiskFilter) => void;
    onStateFilterChange: (value: StateFilter) => void;
    onCreateClick: () => void;
};

const selectClass =
    "h-11 border border-[#3a3a3a] bg-[#111111] px-4 text-[11px] font-mono uppercase tracking-label text-[#C0C0C0] outline-none transition-colors hover:border-[#E85D04]/70 focus:border-[#E85D04]";

export default function ExplorationFilters({
    search,
    riskFilter,
    stateFilter,
    onSearchChange,
    onRiskFilterChange,
    onStateFilterChange,
    onCreateClick,
}: Props) {
    return (
        <section className="border border-[#3a3a3a] bg-[#1a1a1a] p-4 shadow-[0_0_18px_rgba(0,0,0,0.35)]">
            <div className="mb-4 flex flex-col gap-1 border-b border-[#3a3a3a] pb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-label text-[#E85D04]">
                    Search panel
                </span>
                <span className="text-[10px] font-mono uppercase tracking-label text-[#6B7280]">
                    Filter explorations by code, name, risk, or status
                </span>
            </div>

            <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex h-11 w-full overflow-hidden border border-[#3a3a3a] bg-[#111111] transition-colors focus-within:border-[#E85D04] lg:flex-1">
                    <div className="flex h-full w-11 shrink-0 items-center justify-center border-r border-[#3a3a3a] bg-[#242424]">
                        <Search className="h-4 w-4 text-[#E85D04]" />
                    </div>

                    <input
                        type="text"
                        placeholder="Search by code, name, or objective..."
                        className="h-full w-full bg-transparent px-4 text-[12px] font-mono text-white outline-none placeholder:text-[#6B7280]"
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:w-auto lg:items-center">
                    <select
                        value={riskFilter}
                        onChange={(event) =>
                            onRiskFilterChange(event.target.value as RiskFilter)
                        }
                        className={`${selectClass} w-full lg:w-[135px]`}
                    >
                        <option value="todas">Risk</option>
                        <option value="L">Low</option>
                        <option value="M">Medium</option>
                        <option value="H">High</option>
                    </select>

                    <select
                        value={stateFilter}
                        onChange={(event) =>
                            onStateFilterChange(event.target.value as StateFilter)
                        }
                        className={`${selectClass} w-full lg:w-[145px]`}
                    >
                        <option value="todas">Status</option>
                        <option value="P">Pending</option>
                        <option value="A">Active</option>
                        <option value="F">Finished</option>
                        <option value="C">Cancelled</option>
                    </select>

                    <button
                        type="button"
                        onClick={onCreateClick}
                        className="flex h-11 w-full items-center justify-center gap-2 border border-[#E85D04] bg-[#E85D04] px-5 text-[11px] font-mono font-bold uppercase tracking-label text-[#111111] transition-colors hover:bg-[#FF6A10] disabled:cursor-not-allowed disabled:opacity-60 lg:w-[220px]"
                    >
                        <Plus className="h-4 w-4" />
                        <span>New exploration</span>
                    </button>
                </div>
            </div>
        </section>
    );
}