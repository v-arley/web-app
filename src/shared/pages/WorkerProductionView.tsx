import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Database,
  RefreshCw,
  Scale,
  Terminal,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useResourceProduction } from "../hooks/useResourceProduction";
import { WorkerProductionResultAlert } from "../components/WorkerComponents/production/WorkerProductionResultAlert";
import { WorkerProductionRulesPanel } from "../components/WorkerComponents/production/WorkerProductionRulesPanel";
import {
  formatDate,
  getEffectiveDate,
  getExpectedAmount,
  getHistoryExpected,
  getHistoryResource,
  getProductionDate,
  getProfessionName,
  getResourceCode,
  getResourceId,
  getResourceName,
  getResourceUnit,
  getTodayDate,
} from "../components/WorkerComponents/production/workerProductionUtils";

export function WorkerProductionView() {
  const {
    rules,
    history,
    page,
    setPage,
    loading,
    saving,
    error,
    lastResult,
    reload,
    saveProduction,
    clearLastResult,
  } = useResourceProduction();

  const [selectedRuleIndex, setSelectedRuleIndex] = useState(0);
  const selectedRule = rules[selectedRuleIndex] ?? rules[0] ?? null;

  const expectedAmount = getExpectedAmount(selectedRule);
  const resourceId = getResourceId(selectedRule);
  const unit = getResourceUnit(selectedRule);

  const [amountValue, setAmountValue] = useState("");
  const [productionDate, setProductionDate] = useState(getTodayDate());

  const amount = useMemo(() => {
    if (amountValue.trim() === "") return expectedAmount || 0;

    const parsedAmount = Number(amountValue);
    if (Number.isNaN(parsedAmount)) return 0;

    return parsedAmount;
  }, [amountValue, expectedAmount]);

  const realEfficiency = useMemo(() => {
    if (!expectedAmount || expectedAmount <= 0) return 100;
    return Math.round((amount / expectedAmount) * 100);
  }, [amount, expectedAmount]);

  const visualEfficiency = Math.min(100, realEfficiency);
  const isBelowQuota = amount < expectedAmount;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedRule || !resourceId || amount <= 0) return;

    await saveProduction(resourceId, amount, productionDate);
    setAmountValue("");
  }

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden min-w-0">
      <div className="w-full bg-black/60 backdrop-blur-sm border-b border-white/10 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-mono font-bold text-white uppercase tracking-[0.18em] break-words">
            Daily production
          </span>
          <span className="text-[10px] font-mono text-[#9A9A9A] uppercase tracking-[0.14em] break-words">
            Worker resource production / rule based registry
          </span>
        </div>

        <button
          type="button"
          onClick={() => void reload()}
          className="flex items-center gap-2 border border-white/10 bg-black/60 backdrop-blur-sm px-3 py-1.5 text-[10px] font-mono text-[#C0C0C0] hover:text-[#E85D04] hover:border-[#E85D04]/40 uppercase tracking-[0.14em] transition-colors shrink-0"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-transparent">
        <div className="p-3 sm:p-4 space-y-4">
          {error && (
            <div className="border border-[#E85D04]/50 bg-black/70 backdrop-blur-sm text-[#E85D04] px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] flex items-start sm:items-center gap-2 break-words">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 sm:mt-0" />
              {error}
            </div>
          )}

          {lastResult && (
            <WorkerProductionResultAlert
              lastResult={lastResult}
              unit={unit}
              clearLastResult={clearLastResult}
            />
          )}

          <WorkerProductionRulesPanel
            rules={rules}
            loading={loading}
            selectedRuleIndex={selectedRuleIndex}
            setSelectedRuleIndex={setSelectedRuleIndex}
            setAmountValue={setAmountValue}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <section className="lg:col-span-5 border border-[#E85D04]/35 bg-black/65 backdrop-blur-sm p-4 sm:p-5 min-w-0">
              <div className="border-b border-white/10 pb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Scale size={18} className="text-[#E85D04] shrink-0" />
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-[0.14em] break-words">
                    Selected rule
                  </h3>
                </div>

                <span className="font-mono text-[10px] bg-black/60 text-[#E85D04] px-2 py-0.5 border border-[#E85D04]/40 uppercase font-bold whitespace-nowrap shrink-0">
                  {selectedRule?.state === "A" ? "Active" : "N/A"}
                </span>
              </div>

              {!selectedRule ? (
                <div className="mt-4 border border-[#FACC15]/40 bg-black/70 p-4 text-[#FACC15] font-mono text-xs uppercase tracking-[0.14em]">
                  Select a rule to record production.
                </div>
              ) : (
                <div className="mt-4 space-y-4 font-mono text-xs">
                  <div className="min-w-0">
                    <span className="text-[#9A9A9A] block uppercase text-[10px] font-bold">
                      Applicable profession
                    </span>
                    <span className="text-white font-medium break-words">
                      {getProfessionName(selectedRule)}
                    </span>
                  </div>

                  <div className="p-3 bg-black/70 border border-white/10 space-y-2 min-w-0">
                    <span className="text-[#9A9A9A] block uppercase text-[10px] font-bold">
                      Assigned resource
                    </span>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3">
                      <span className="text-white font-bold text-sm tracking-[0.14em] break-words">
                        {getResourceName(selectedRule)}
                      </span>

                      <span className="text-[10px] text-[#E85D04] px-2 py-0.5 bg-black/60 border border-white/10 w-fit break-all">
                        {getResourceCode(selectedRule)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="min-w-0">
                        <span className="text-[#9A9A9A] block text-[9px] uppercase">
                          Required quota
                        </span>
                        <strong className="text-[#E85D04] break-words">
                          {expectedAmount} {unit}
                        </strong>
                      </div>

                      <div className="min-w-0">
                        <span className="text-[#9A9A9A] block text-[9px] uppercase">
                          Camp
                        </span>
                        <strong className="text-white break-words">
                          {selectedRule.camp?.code ??
                            selectedRule.camp?.description ??
                            selectedRule.campId ??
                            selectedRule.camp_id}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="min-w-0">
                      <span className="text-[#9A9A9A] block uppercase text-[10px] font-bold">
                        Effective date
                      </span>
                      <span className="text-white font-medium break-words">
                        {formatDate(getEffectiveDate(selectedRule))}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <span className="text-[#9A9A9A] block uppercase text-[10px] font-bold">
                        Resource ID
                      </span>
                      <span className="text-[#38BDF8] font-mono break-words">
                        {resourceId}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="lg:col-span-7 border border-white/10 bg-black/65 backdrop-blur-sm p-4 sm:p-5 min-w-0">
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-[0.14em] border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
                <Terminal size={18} className="text-[#E85D04] shrink-0" />
                <span className="break-words">Daily production record</span>
              </h3>

              <form
                onSubmit={handleSubmit}
                className="space-y-4 font-mono text-xs"
              >
                <div className="min-w-0">
                  <label className="text-[#9A9A9A] block mb-1 uppercase font-bold">
                    Selected resource
                  </label>

                  <div className="p-3 bg-black/70 border border-white/10 text-white uppercase flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 font-bold">
                    <span className="break-words">
                      {selectedRule ? getResourceName(selectedRule) : "N/A"}
                    </span>
                    <span className="text-[10px] text-[#38BDF8] bg-black/60 px-2 py-0.5 border border-white/10 w-fit break-all">
                      {selectedRule ? getResourceCode(selectedRule) : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <label className="text-[#D0D0D0] block mb-1 uppercase font-bold">
                      Amount produced <span className="text-[#EF4444]">*</span>
                    </label>

                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        value={amountValue}
                        placeholder={
                          expectedAmount > 0 ? String(expectedAmount) : "0"
                        }
                        onChange={(event) => setAmountValue(event.target.value)}
                        className="w-full bg-black/70 border border-white/10 focus:border-[#E85D04]/70 p-3 pr-12 outline-none text-white font-bold text-sm placeholder:text-[#7C7C7C]"
                        required
                        disabled={!selectedRule || saving}
                      />

                      <span className="absolute right-3 top-3 text-[10px] text-[#9A9A9A] uppercase">
                        {unit}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <label className="text-[#D0D0D0] block mb-1 uppercase font-bold">
                      Production date
                    </label>

                    <input
                      type="date"
                      value={productionDate}
                      onChange={(event) =>
                        setProductionDate(event.target.value)
                      }
                      className="w-full bg-black/70 border border-white/10 focus:border-[#E85D04]/70 p-3 outline-none text-white text-xs"
                      required
                      disabled={!selectedRule || saving}
                    />
                  </div>
                </div>

                <div className="p-3 bg-black/70 border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-3 mb-2">
                    <span className="text-[#9A9A9A] font-bold uppercase">
                      Current entry efficiency
                    </span>

                    <span
                      className={`font-bold uppercase ${
                        isBelowQuota ? "text-[#FACC15]" : "text-[#22C55E]"
                      }`}
                    >
                      {visualEfficiency}%{" "}
                      {isBelowQuota ? "Below quota" : "Quota met"}
                    </span>
                  </div>

                  <div className="w-full bg-black/75 h-2 overflow-hidden border border-white/10">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isBelowQuota ? "bg-[#FACC15]" : "bg-[#22C55E]"
                      }`}
                      style={{
                        width: `${visualEfficiency}%`,
                      }}
                    />
                  </div>

                  {isBelowQuota ? (
                    <div className="mt-3 p-3 bg-black/65 border border-[#FACC15]/40 text-[11px] text-[#FACC15] flex items-start gap-2">
                      <AlertTriangle
                        size={16}
                        className="shrink-0 mt-0.5 text-[#E85D04]"
                      />
                      <div className="leading-tight min-w-0">
                        <p className="font-bold uppercase break-words">
                          Production below expected quota
                        </p>
                        <p className="text-[10px] mt-1 text-[#D0D0D0] break-words">
                          The expected target for this resource is{" "}
                          {expectedAmount} {unit}.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 bg-black/65 border border-[#22C55E]/40 text-[11px] text-[#22C55E] flex items-start gap-2">
                      <CheckCircle
                        size={16}
                        className="shrink-0 mt-0.5 text-[#22C55E]"
                      />
                      <div className="leading-tight min-w-0">
                        <p className="font-bold uppercase">Quota met</p>
                        <p className="text-[10px] mt-1 text-[#D0D0D0] break-words">
                          The entry meets or exceeds the amount expected by the
                          active rule.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!selectedRule || saving || amount <= 0}
                  className="w-full py-3 bg-[#E85D04] hover:bg-[#FF6A10] disabled:bg-black/70 disabled:text-[#7C7C7C] text-[#111111] font-bold uppercase tracking-[0.14em] transition-colors font-mono"
                >
                  {saving ? "Recording..." : "Record production"}
                </button>
              </form>
            </section>
          </div>

          <section className="border border-white/10 bg-black/65 backdrop-blur-sm overflow-hidden">
            <div className="border-b border-white/10 bg-black/65 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Database size={18} className="text-[#E85D04] shrink-0" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-[0.14em] break-words">
                  Logistic performance history
                </h3>
              </div>

              <span className="font-mono text-xs text-[#9A9A9A] uppercase shrink-0">
                Total records: {history.total}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left font-mono text-xs border-collapse">
                <thead className="bg-black/70 text-[#9A9A9A] font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3 pl-4">Entry ID</th>
                    <th className="p-3">Production date</th>
                    <th className="p-3">Resource</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Expected target</th>
                    <th className="p-3 pr-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10 bg-black/65 text-[#D0D0D0]">
                  {history.items.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-6 text-center text-[#9A9A9A] uppercase tracking-[0.14em]"
                      >
                        No production records.
                      </td>
                    </tr>
                  )}

                  {history.items.map((item) => {
                    const rowExpected = getHistoryExpected(item, selectedRule);
                    const achieved =
                      item.achieved ?? item.amount >= rowExpected;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-[#E85D04]/10 transition-colors"
                      >
                        <td className="p-3 pl-4 font-bold text-[#38BDF8]">
                          {item.id}
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <Calendar size={13} className="text-[#9A9A9A]" />
                            {formatDate(getProductionDate(item))}
                          </div>
                        </td>

                        <td className="p-3 text-white">
                          {getHistoryResource(item, selectedRule)}
                        </td>

                        <td className="p-3 whitespace-nowrap">
                          <span className="font-bold text-[#E85D04]">
                            {item.amount}
                          </span>{" "}
                          {unit}
                        </td>

                        <td className="p-3 text-[#FACC15] whitespace-nowrap">
                          {rowExpected} {unit}
                        </td>

                        <td className="p-3 pr-4">
                          <span
                            className={`px-2 py-0.5 border text-[10px] uppercase font-bold whitespace-nowrap ${
                              achieved
                                ? "border-[#22C55E]/50 bg-black/60 text-[#22C55E]"
                                : "border-[#FACC15]/50 bg-black/60 text-[#FACC15]"
                            }`}
                          >
                            {achieved ? "Quota met" : "Below quota"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-black/65 border-t border-white/10 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <span className="font-mono text-[10px] text-[#9A9A9A] uppercase tracking-[0.14em]">
                Page {history.page} of {history.totalPages || 1}
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
                  onClick={() =>
                    setPage(Math.min(history.totalPages || 1, page + 1))
                  }
                  disabled={page >= (history.totalPages || 1)}
                  className="px-3 py-1.5 text-xs border border-white/10 bg-black/60 hover:border-[#E85D04]/50 disabled:opacity-40 disabled:hover:border-white/10 text-white hover:text-[#E85D04] transition-colors font-mono uppercase flex items-center gap-1 whitespace-nowrap tracking-[0.14em]"
                >
                  Next
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
