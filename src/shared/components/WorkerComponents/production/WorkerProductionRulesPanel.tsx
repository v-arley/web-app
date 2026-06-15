import type { CampProductionRule } from "../../../../models/CampProductionRule";
import {
  formatDate,
  getEffectiveDate,
  getExpectedAmount,
  getResourceCode,
  getResourceId,
  getResourceName,
  getResourceUnit,
} from "./workerProductionUtils";

type WorkerProductionRulesPanelProps = {
  rules: CampProductionRule[];
  loading: boolean;
  selectedRuleIndex: number;
  setSelectedRuleIndex: (value: number) => void;
  setAmountValue: (value: string) => void;
};

export function WorkerProductionRulesPanel({
  rules,
  loading,
  selectedRuleIndex,
  setSelectedRuleIndex,
  setAmountValue,
}: WorkerProductionRulesPanelProps) {
  return (
    <section className="border border-[#38BDF8]/35 bg-black/65 backdrop-blur-sm p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="min-w-0">
          <span className="text-[10px] text-[#9A9A9A] font-mono uppercase tracking-[0.14em] break-words">
            Available production rules
          </span>
          <h3 className="text-sm text-white font-mono font-bold uppercase tracking-[0.14em] break-words">
            Select the resource you will produce
          </h3>
        </div>

        <span className="text-[#38BDF8] border border-[#38BDF8]/50 bg-black/60 px-3 py-1 text-[10px] font-mono uppercase font-bold w-full sm:w-auto text-center shrink-0">
          {rules.length} rule(s)
        </span>
      </div>

      {loading ? (
        <div className="text-[#9A9A9A] font-mono text-xs uppercase tracking-[0.14em]">
          Loading production rules...
        </div>
      ) : rules.length === 0 ? (
        <div className="border border-[#FACC15]/40 bg-black/70 p-4 text-[#FACC15] font-mono text-xs uppercase tracking-[0.14em]">
          No production rules assigned.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {rules.map((item, index) => {
            const selected = selectedRuleIndex === index;

            return (
              <button
                key={`${getResourceId(item)}-${String(getEffectiveDate(item))}-${index}`}
                type="button"
                onClick={() => {
                  setSelectedRuleIndex(index);
                  setAmountValue("");
                }}
                className={`text-left border-2 p-3 transition-all font-mono min-w-0 ${
                  selected
                    ? "border-[#E85D04] bg-[#E85D04]/10 text-white shadow-[0_0_0_1px_rgba(232,93,4,0.45)] hover:shadow-[0_0_18px_rgba(232,93,4,0.55)]"
                    : "border-[#38BDF8] bg-[#111111] text-[#C0C0C0] shadow-[0_0_0_1px_rgba(56,189,248,0.45)] hover:shadow-[0_0_18px_rgba(56,189,248,0.55)]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#9A9A9A] uppercase tracking-[0.14em] break-all">
                    {getResourceCode(item)}
                  </span>

                  <span
                    className={`text-[9px] border px-2 py-0.5 uppercase whitespace-nowrap shrink-0 ${
                      selected
                        ? "text-[#E85D04] border-[#E85D04]/60 bg-black/60"
                        : "text-[#38BDF8] border-[#38BDF8]/40 bg-black/60"
                    }`}
                  >
                    {selected ? "Selected" : "Available"}
                  </span>
                </div>

                <div className="mt-2 text-sm font-bold uppercase tracking-[0.14em] break-words">
                  {getResourceName(item)}
                </div>

                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                  <div className="min-w-0">
                    <span className="block text-[#9A9A9A] uppercase">
                      Quota
                    </span>
                    <strong className="text-[#FACC15] break-words">
                      {getExpectedAmount(item)} {getResourceUnit(item)}
                    </strong>
                  </div>

                  <div className="min-w-0">
                    <span className="block text-[#9A9A9A] uppercase">From</span>
                    <strong className="text-white break-words">
                      {formatDate(getEffectiveDate(item))}
                    </strong>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
