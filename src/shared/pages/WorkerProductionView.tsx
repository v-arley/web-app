import {
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Database,
  RefreshCw,
  Scale,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useResourceProduction } from "../hooks/useResourceProduction";
import type { CampProductionRule } from "../../models/CampProductionRule";
import type { WorkerProductionHistoryItem } from "../../models/ResourceProduction";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(value?: string | Date | null) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getExpectedAmount(rule?: CampProductionRule | null) {
  return rule?.expectedAmount ?? rule?.expected_amount ?? 0;
}

function getEffectiveDate(rule?: CampProductionRule | null) {
  return rule?.effectiveDate ?? rule?.effective_date;
}

function getResourceId(rule?: CampProductionRule | null) {
  return rule?.resourceId ?? rule?.resource_id ?? rule?.resource?.id ?? 0;
}

function getResourceName(rule?: CampProductionRule | null) {
  return rule?.resource?.name ?? `Recurso #${getResourceId(rule) || "N/A"}`;
}

function getResourceCode(rule?: CampProductionRule | null) {
  return rule?.resource?.code ?? `RES-${getResourceId(rule) || "N/A"}`;
}

function getResourceUnit(rule?: CampProductionRule | null) {
  return (
    rule?.resource?.unitOfMeasure ??
    rule?.resource?.unit_of_measure ??
    rule?.resource?.unitName ??
    rule?.resource?.unit_name ??
    rule?.resource?.unit ??
    "u"
  );
}

function getProfessionName(rule?: CampProductionRule | null) {
  return (
    rule?.profession?.name ??
    `Profesión #${rule?.professionId ?? rule?.profession_id ?? "N/A"}`
  );
}

function getProductionDate(item: WorkerProductionHistoryItem) {
  return item.productionDate ?? item.production_date;
}

function getHistoryResource(
  item: WorkerProductionHistoryItem,
  rule?: CampProductionRule | null,
) {
  return (
    item.resource?.name ??
    rule?.resource?.name ??
    `Recurso #${item.resourceId ?? item.resource_id ?? "N/A"}`
  );
}

function getHistoryExpected(
  item: WorkerProductionHistoryItem,
  rule?: CampProductionRule | null,
) {
  return item.expectedAmount ?? item.expected_amount ?? getExpectedAmount(rule);
}

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
    <div className="w-full h-full flex flex-col bg-[#111111] overflow-hidden">
      <div className="w-full bg-[#242424] border-b border-[#3a3a3a] px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <span className="text-[12px] font-mono font-bold text-[#C0C0C0] uppercase tracking-label">
            Daily production
          </span>
          <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-label">
            Worker resource production / rule based registry
          </span>
        </div>

        <button
          type="button"
          onClick={() => void reload()}
          className="flex items-center gap-2 text-[11px] font-mono text-[#6B7280] hover:text-[#E85D04] uppercase tracking-label transition-colors"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-4">
          {error && (
            <div className="border border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04] px-4 py-3 font-mono text-xs uppercase tracking-label flex items-center gap-2">
              <AlertTriangle size={15} />
              {error}
            </div>
          )}

          {lastResult && (
            <div className="p-4 bg-[#22C55E]/10 border border-[#22C55E]/50 text-[#22C55E] font-mono text-xs space-y-2 shadow-[0_0_14px_rgba(34,197,94,0.18)]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-[#FACC15]" />
                  <span className="font-bold uppercase tracking-label">
                    Production recorded successfully
                  </span>
                </div>

                <button
                  type="button"
                  onClick={clearLastResult}
                  className="text-[#6B7280] hover:text-[#22C55E] uppercase tracking-label"
                >
                  Close
                </button>
              </div>

              <p className="text-[#C0C0C0]">
                Recorded{" "}
                <strong className="text-[#FACC15]">{lastResult.amount}</strong>{" "}
                {unit}.
              </p>

              {lastResult.pointsAwarded !== undefined && (
                <p className="text-[#C0C0C0]">
                  Points awarded:{" "}
                  <strong className="text-[#FACC15]">
                    +{lastResult.pointsAwarded}
                  </strong>
                </p>
              )}

              {lastResult.points && (
                <p className="text-[#C0C0C0]">
                  Current total:{" "}
                  <strong className="text-[#FACC15]">
                    {lastResult.points.totalPoints ??
                      lastResult.points.total_points ??
                      0}
                  </strong>{" "}
                  | Level:{" "}
                  <strong className="text-[#FACC15]">
                    {lastResult.points.level ?? "N/A"}
                  </strong>
                </p>
              )}

              {!!lastResult.unlockedAchievements?.length && (
                <div className="border border-[#FACC15]/40 bg-[#FACC15]/10 p-3 text-[#FACC15]">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-label">
                    <Award size={15} />
                    Unlocked achievements
                  </div>

                  <p className="mt-1 text-[#C0C0C0]">
                    Unlocked {lastResult.unlockedAchievements.length} new
                    achievement(s).
                  </p>
                </div>
              )}
            </div>
          )}

          <section className="border border-[#38BDF8]/45 bg-[#1a1a1a] p-4 shadow-[0_0_18px_rgba(56,189,248,0.1)]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-[10px] text-[#6B7280] font-mono uppercase tracking-label">
                  Available production rules
                </span>
                <h3 className="text-sm text-white font-mono font-bold uppercase tracking-label">
                  Select the resource you will produce
                </h3>
              </div>

              <span className="text-[#38BDF8] border border-[#38BDF8]/50 bg-[#38BDF8]/10 px-3 py-1 text-[10px] font-mono uppercase font-bold">
                {rules.length} rule(s)
              </span>
            </div>

            {loading ? (
              <div className="text-[#6B7280] font-mono text-xs uppercase tracking-label">
                Loading production rules...
              </div>
            ) : rules.length === 0 ? (
              <div className="border border-[#FACC15]/40 bg-[#FACC15]/10 p-4 text-[#FACC15] font-mono text-xs uppercase tracking-label">
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
                      className={`text-left border p-3 transition-colors font-mono ${
                        selected
                          ? "border-[#E85D04] bg-[#E85D04]/10 text-white"
                          : "border-[#3a3a3a] bg-[#111111] text-[#C0C0C0] hover:border-[#38BDF8]/70"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-[#6B7280] uppercase tracking-label">
                          {getResourceCode(item)}
                        </span>

                        <span
                          className={`text-[9px] border px-2 py-0.5 uppercase ${
                            selected
                              ? "text-[#E85D04] border-[#E85D04]/60"
                              : "text-[#38BDF8] border-[#38BDF8]/40"
                          }`}
                        >
                          {selected ? "Selected" : "Available"}
                        </span>
                      </div>

                      <div className="mt-2 text-sm font-bold uppercase tracking-label">
                        {getResourceName(item)}
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="block text-[#6B7280] uppercase">
                            Quota
                          </span>
                          <strong className="text-[#FACC15]">
                            {getExpectedAmount(item)} {getResourceUnit(item)}
                          </strong>
                        </div>

                        <div>
                          <span className="block text-[#6B7280] uppercase">
                            From
                          </span>
                          <strong className="text-white">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <section className="lg:col-span-5 border border-[#E85D04]/45 bg-[#1a1a1a] p-5 shadow-[0_0_18px_rgba(232,93,4,0.1)]">
              <div className="border-b border-[#3a3a3a] pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale size={18} className="text-[#E85D04]" />
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-label">
                    Selected rule
                  </h3>
                </div>

                <span className="font-mono text-[10px] bg-[#E85D04]/15 text-[#E85D04] px-2 py-0.5 border border-[#E85D04]/40 uppercase font-bold">
                  {selectedRule?.state === "A" ? "Active" : "N/A"}
                </span>
              </div>

              {!selectedRule ? (
                <div className="mt-4 border border-[#FACC15]/40 bg-[#FACC15]/10 p-4 text-[#FACC15] font-mono text-xs uppercase tracking-label">
                  Select a rule to record production.
                </div>
              ) : (
                <div className="mt-4 space-y-4 font-mono text-xs">
                  <div>
                    <span className="text-[#6B7280] block uppercase text-[10px] font-bold">
                      Applicable profession
                    </span>
                    <span className="text-white font-medium">
                      {getProfessionName(selectedRule)}
                    </span>
                  </div>

                  <div className="p-3 bg-[#111111] border border-[#3a3a3a] space-y-2">
                    <span className="text-[#6B7280] block uppercase text-[10px] font-bold">
                      Assigned resource
                    </span>

                    <div className="flex justify-between items-center gap-3">
                      <span className="text-white font-bold text-sm tracking-label">
                        {getResourceName(selectedRule)}
                      </span>

                      <span className="text-[10px] text-[#E85D04] px-2 py-0.5 bg-[#242424] border border-[#3a3a3a]">
                        {getResourceCode(selectedRule)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#3a3a3a] grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[#6B7280] block text-[9px] uppercase">
                          Required quota
                        </span>
                        <strong className="text-[#E85D04]">
                          {expectedAmount} {unit}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[#6B7280] block text-[9px] uppercase">
                          Camp
                        </span>
                        <strong className="text-white">
                          {selectedRule.camp?.code ??
                            selectedRule.camp?.description ??
                            selectedRule.campId ??
                            selectedRule.camp_id}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[#6B7280] block uppercase text-[10px] font-bold">
                        Effective date
                      </span>
                      <span className="text-white font-medium">
                        {formatDate(getEffectiveDate(selectedRule))}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#6B7280] block uppercase text-[10px] font-bold">
                        Resource ID
                      </span>
                      <span className="text-[#38BDF8] font-mono">
                        {resourceId}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="lg:col-span-7 border border-[#3a3a3a] bg-[#1a1a1a] p-5">
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-label border-b border-[#3a3a3a] pb-3 mb-4 flex items-center gap-2">
                <Terminal size={18} className="text-[#E85D04]" />
                Daily production record
              </h3>

              <form
                onSubmit={handleSubmit}
                className="space-y-4 font-mono text-xs"
              >
                <div>
                  <label className="text-[#6B7280] block mb-1 uppercase font-bold">
                    Selected resource
                  </label>

                  <div className="p-3 bg-[#111111] border border-[#3a3a3a] text-white uppercase flex justify-between items-center font-bold">
                    <span>
                      {selectedRule ? getResourceName(selectedRule) : "N/A"}
                    </span>
                    <span className="text-[10px] text-[#38BDF8] bg-[#242424] px-2 py-0.5 border border-[#3a3a3a]">
                      {selectedRule ? getResourceCode(selectedRule) : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#C0C0C0] block mb-1 uppercase font-bold">
                      Amount produced
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
                        className="w-full bg-[#111111] border border-[#3a3a3a] focus:border-[#E85D04] p-3 outline-none text-white font-bold text-sm placeholder:text-[#6B7280]"
                        required
                        disabled={!selectedRule || saving}
                      />

                      <span className="absolute right-3 top-3 text-[10px] text-[#6B7280] uppercase">
                        {unit}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[#C0C0C0] block mb-1 uppercase font-bold">
                      Production date
                    </label>

                    <input
                      type="date"
                      value={productionDate}
                      onChange={(event) =>
                        setProductionDate(event.target.value)
                      }
                      className="w-full bg-[#111111] border border-[#3a3a3a] focus:border-[#E85D04] p-3 outline-none text-white text-xs"
                      required
                      disabled={!selectedRule || saving}
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#111111] border border-[#3a3a3a]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#6B7280] font-bold uppercase">
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

                  <div className="w-full bg-[#242424] h-2 overflow-hidden border border-[#3a3a3a]">
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
                    <div className="mt-3 p-3 bg-[#FACC15]/10 border border-[#FACC15]/40 text-[11px] text-[#FACC15] flex items-start gap-2">
                      <AlertTriangle
                        size={16}
                        className="shrink-0 mt-0.5 text-[#E85D04]"
                      />
                      <div className="leading-tight">
                        <p className="font-bold uppercase">
                          Production below expected quota
                        </p>
                        <p className="text-[10px] mt-1 text-[#C0C0C0]">
                          The expected target for this resource is{" "}
                          {expectedAmount} {unit}.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 bg-[#22C55E]/10 border border-[#22C55E]/40 text-[11px] text-[#22C55E] flex items-start gap-2">
                      <CheckCircle
                        size={16}
                        className="shrink-0 mt-0.5 text-[#22C55E]"
                      />
                      <div className="leading-tight">
                        <p className="font-bold uppercase">Quota met</p>
                        <p className="text-[10px] mt-1 text-[#C0C0C0]">
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
                  className="w-full py-3 bg-[#E85D04] hover:bg-[#FF6A10] disabled:bg-[#3a3a3a] disabled:text-[#6B7280] text-[#111111] font-bold uppercase tracking-label transition-colors font-mono"
                >
                  {saving ? "Recording..." : "Record production"}
                </button>
              </form>
            </section>
          </div>

          <section className="border border-[#3a3a3a] bg-[#1a1a1a] overflow-hidden">
            <div className="border-b border-[#3a3a3a] bg-[#242424] p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Database size={18} className="text-[#E85D04]" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-label">
                  Logistic performance history
                </h3>
              </div>

              <span className="font-mono text-xs text-[#6B7280] uppercase">
                Total records: {history.total}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead className="bg-[#111111] text-[#6B7280] font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3 pl-4">Entry ID</th>
                    <th className="p-3">Production date</th>
                    <th className="p-3">Resource</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Expected target</th>
                    <th className="p-3 pr-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#3a3a3a] bg-[#1a1a1a] text-[#C0C0C0]">
                  {history.items.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-6 text-center text-[#6B7280] uppercase tracking-label"
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
                        className="hover:bg-[#242424] transition-colors"
                      >
                        <td className="p-3 pl-4 font-bold text-[#38BDF8]">
                          {item.id}
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Calendar size={13} className="text-[#6B7280]" />
                            {formatDate(getProductionDate(item))}
                          </div>
                        </td>

                        <td className="p-3 text-white">
                          {getHistoryResource(item, selectedRule)}
                        </td>

                        <td className="p-3">
                          <span className="font-bold text-[#E85D04]">
                            {item.amount}
                          </span>{" "}
                          {unit}
                        </td>

                        <td className="p-3 text-[#FACC15]">
                          {rowExpected} {unit}
                        </td>

                        <td className="p-3 pr-4">
                          <span
                            className={`px-2 py-0.5 border text-[10px] uppercase font-bold ${
                              achieved
                                ? "border-[#22C55E]/50 bg-[#22C55E]/10 text-[#22C55E]"
                                : "border-[#FACC15]/50 bg-[#FACC15]/10 text-[#FACC15]"
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

            <div className="p-3 bg-[#111111] border-t border-[#3a3a3a] flex justify-between items-center">
              <span className="font-mono text-[10px] text-[#6B7280] uppercase tracking-label">
                Page {history.page} of {history.totalPages || 1}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 text-xs border border-[#3a3a3a] hover:border-[#E85D04] disabled:opacity-40 disabled:hover:border-[#3a3a3a] text-white transition-colors font-mono uppercase flex items-center gap-1"
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
                  className="px-3 py-1.5 text-xs border border-[#3a3a3a] hover:border-[#E85D04] disabled:opacity-40 disabled:hover:border-[#3a3a3a] text-white transition-colors font-mono uppercase flex items-center gap-1"
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
