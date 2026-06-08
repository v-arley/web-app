import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle, Package, Search, X, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ResourceService } from "../../../../services/ResourceService";
import type { Resource } from "../../../../models/Resource";
import { useRequestResourcesQuery } from "../hooks/useRequestResourcesQuery";
import { useCampRequestByIdQuery, useRequestResourceAvailabilityQuery } from "../hooks/useCampRequestsQuery";

const resourceService = new ResourceService();

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  P: { label: "PENDING", color: "text-status-warning", bg: "bg-status-warning/10", border: "border-status-warning/30" },
  A: { label: "APPROVED", color: "text-status-ok", bg: "bg-status-ok/10", border: "border-status-ok/30" },
  R: { label: "REJECTED", color: "text-status-critical", bg: "bg-status-critical/10", border: "border-status-critical/30" },
};

interface RequestDetailModalProps {
  requestId: number;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  requestStatus?: string;
  isLoading?: boolean;
  canViewResourceAvailability?: boolean;
}

export function RequestDetailModal({
  requestId,
  onClose,
  onApprove,
  onReject,
  requestStatus,
  isLoading = false,
  canViewResourceAvailability = false,
}: RequestDetailModalProps) {
  const [resourceSearch, setResourceSearch] = useState("");
  const [showOnlyShortages, setShowOnlyShortages] = useState(false);
  const statusMeta = STATUS_META[requestStatus ?? "P"] ?? STATUS_META.P;
  const { data: request } = useCampRequestByIdQuery(requestId);
  const { data: resources = [] } = useRequestResourcesQuery(requestId);
  const { data: availability, isLoading: isAvailabilityLoading } = useRequestResourceAvailabilityQuery(
    requestId,
    canViewResourceAvailability,
  );

  const { data: availableResources = [] } = useQuery({
    queryKey: ["resources-list"],
    queryFn: async () => {
      const res = await resourceService.findAll();
      return res.getResultado<Resource[]>("registros") ?? [];
    },
  });

  const resourceNameById = useMemo(
    () => new Map(availableResources.map((resource) => [resource.id, resource.name])),
    [availableResources],
  );
  const requesterLabel = request?.origin_camp?.code || request?.origin_camp?.description || "UNRESOLVED CAMP";
  const providerLabel = request?.destination_camp?.code || request?.destination_camp?.description || "UNRESOLVED CAMP";
  const availabilityByResourceId = useMemo(
    () => new Map(availability?.items.map((item) => [item.resource_id, item]) ?? []),
    [availability],
  );

  const availabilityRows = useMemo(() => {
    return resources.map((resource) => {
      const item = availabilityByResourceId.get(resource.resource_id);
      const requestedAmount = item?.requested_amount ?? resource.amount;
      const availableAmount = item?.available_amount ?? null;
      return {
        resource_id: resource.resource_id,
        name: resourceNameById.get(resource.resource_id) || `ID: ${resource.resource_id}`,
        requestedAmount,
        availableAmount,
        missingAmount: availableAmount == null ? null : Math.max(requestedAmount - availableAmount, 0),
        enough: item?.enough ?? null,
      };
    });
  }, [availabilityByResourceId, resourceNameById, resources]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = resourceSearch.trim().toLowerCase();
    return availabilityRows.filter((item) => {
      if (showOnlyShortages && item.enough) return false;
      if (!normalizedSearch) return true;
      return item.name.toLowerCase().includes(normalizedSearch) || String(item.resource_id).includes(normalizedSearch);
    });
  }, [availabilityRows, resourceSearch, showOnlyShortages]);

  const totalRequested = availabilityRows.reduce((sum, item) => sum + item.requestedAmount, 0);
  const totalAvailable = canViewResourceAvailability
    ? availabilityRows.reduce((sum, item) => sum + (item.availableAmount ?? 0), 0)
    : null;
  const shortageCount = availabilityRows.filter((item) => item.enough === false).length;
  const isApproveDisabled =
    isLoading ||
    (canViewResourceAvailability && (isAvailabilityLoading || !availability || availability.has_sufficient_stock === false));
  const stockStatusLabel = !canViewResourceAvailability
    ? "PROVIDER ONLY"
    : isAvailabilityLoading
      ? "CHECKING"
      : availability
        ? availability.has_sufficient_stock ? "AVAILABLE" : "INSUFFICIENT"
        : "UNAVAILABLE";

  function handleClose() {
    if (!isLoading) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="relative flex h-[100dvh] w-full flex-col border-border-strong bg-bg-tertiary/95 shadow-2xl sm:h-[min(92dvh,760px)] sm:max-w-6xl sm:border">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-bg-secondary/70 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden h-8 w-0.5 bg-accent sm:block" />
            <Package size={16} className="shrink-0 text-accent" />
            <div className="min-w-0">
              <div className="truncate font-mono text-[11px] font-bold uppercase tracking-widest text-txt-primary">REQUEST DETAIL</div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-txt-muted">REQ-{requestId}</div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className={`border px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${statusMeta.color} ${statusMeta.bg} ${statusMeta.border}`}>
              {statusMeta.label}
            </span>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="grid h-8 w-8 place-items-center border border-border-default bg-bg-secondary/60 text-txt-secondary transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
              aria-label="Close request detail"
            >
              <X size={15} />
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:grid-rows-1">
          <aside className="border-b border-border-subtle bg-bg-secondary/35 p-4 lg:border-b-0 lg:border-r lg:p-5">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <div className="min-w-0 border border-border-subtle bg-bg-tertiary/45 p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-txt-disabled">Sender</div>
                <div className="mt-1 truncate font-mono text-[12px] font-bold text-txt-primary">{providerLabel}</div>
              </div>
              <div className="min-w-0 border border-border-subtle bg-bg-tertiary/45 p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-txt-disabled">Receiver</div>
                <div className="mt-1 truncate font-mono text-[12px] font-bold text-txt-primary">{requesterLabel}</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <Metric label="Items" value={availabilityRows.length} />
              <Metric label="Requested" value={totalRequested} />
              <Metric label="Available" value={totalAvailable ?? "-"} tone={availability?.has_sufficient_stock ? "ok" : undefined} />
            </div>

            <div className={`mt-3 flex items-center justify-between gap-3 border px-3 py-2 ${availability?.has_sufficient_stock === false ? "border-status-critical/50 bg-status-critical/10" : "border-border-subtle bg-bg-tertiary/45"}`}>
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-widest text-txt-disabled">Provider stock</div>
                <div className={`mt-0.5 font-mono text-[11px] font-bold uppercase tracking-widest ${availability?.has_sufficient_stock === false ? "text-status-critical" : "text-status-ok"}`}>
                  {stockStatusLabel}
                </div>
              </div>
              {shortageCount > 0 && (
                <div className="flex shrink-0 items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-widest text-status-critical">
                  <AlertTriangle size={14} />
                  {shortageCount}
                </div>
              )}
            </div>

            <div className="mt-3 hidden border border-border-subtle bg-bg-tertiary/35 p-3 lg:block">
              <div className="font-mono text-[10px] uppercase tracking-widest text-txt-disabled">Action mode</div>
              <div className="mt-1 font-mono text-[11px] font-bold uppercase tracking-widest text-txt-secondary">
                {onApprove || onReject ? "INTERACTIVE" : "READ-ONLY"}
              </div>
            </div>
          </aside>

          <main className="flex min-h-0 flex-col overflow-hidden">
            <section className="shrink-0 border-b border-border-subtle bg-bg-tertiary/75 px-4 py-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-txt-primary">Resources</div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-txt-muted">
                    {filteredRows.length} of {availabilityRows.length}
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  {/* <label className="flex h-9 items-center gap-2 border border-border-default bg-bg-secondary/50 px-3 font-mono text-[10px] uppercase tracking-widest text-txt-secondary">
                    <input
                      type="checkbox"
                      checked={showOnlyShortages}
                      onChange={(event) => setShowOnlyShortages(event.target.checked)}
                      className="h-3.5 w-3.5 accent-status-critical"
                    />
                    Shortages
                  </label> */}
                  <div className="flex h-9 min-w-0 items-center gap-2 border border-border-default bg-bg-secondary/50 px-3 sm:w-64">
                    <Search size={13} className="shrink-0 text-txt-muted" />
                    <input
                      value={resourceSearch}
                      onChange={(event) => setResourceSearch(event.target.value)}
                      placeholder="Search resource"
                      className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-txt-primary outline-none placeholder:text-txt-disabled"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="min-h-0 flex-1 overflow-hidden">
              <div className="hidden h-full overflow-auto sm:block">
                <table className="w-full table-fixed border-collapse">
                  <thead className="sticky top-0 z-10 bg-bg-secondary">
                    <tr className="border-b border-border-subtle">
                      <th className="w-[40%] px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-txt-disabled">Resource</th>
                      <th className="w-[18%] px-3 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-txt-disabled">Requested</th>
                      <th className="w-[18%] px-3 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-txt-disabled">Available</th>
                      <th className="w-[18%] px-3 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-txt-disabled">Missing</th>
                      <th className="w-[6%] px-3 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-txt-disabled">State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((item) => (
                      <tr key={item.resource_id} className={`border-b border-border-subtle ${item.enough ? "bg-bg-tertiary/35" : "bg-status-critical/10"}`}>
                        <td className="min-w-0 px-4 py-3">
                          <div className="truncate font-mono text-[12px] font-bold text-txt-primary">{item.name}</div>
                          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-txt-muted">Resource #{item.resource_id}</div>
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-[12px] font-bold text-txt-primary">{item.requestedAmount}</td>
                        <td className={`px-3 py-3 text-right font-mono text-[12px] font-bold ${item.enough == null ? "text-txt-secondary" : item.enough ? "text-status-ok" : "text-status-critical"}`}>{item.availableAmount ?? "-"}</td>
                        <td className={`px-3 py-3 text-right font-mono text-[12px] font-bold ${item.missingAmount != null && item.missingAmount > 0 ? "text-status-critical" : "text-txt-secondary"}`}>{item.missingAmount ?? "-"}</td>
                        <td className="px-3 py-3 text-center">
                          {item.enough == null ? <Package size={14} className="mx-auto text-txt-muted" /> : item.enough ? <CheckCircle size={14} className="mx-auto text-status-ok" /> : <AlertTriangle size={14} className="mx-auto text-status-critical" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="h-full space-y-2 overflow-auto p-3 sm:hidden">
                {filteredRows.map((item) => (
                  <article key={item.resource_id} className={`border p-3 ${item.enough ? "border-border-subtle bg-bg-secondary/35" : "border-status-critical/50 bg-status-critical/10"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-mono text-[12px] font-bold text-txt-primary">{item.name}</div>
                        <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-txt-muted">Resource #{item.resource_id}</div>
                      </div>
                      {item.enough ? <CheckCircle size={15} className="shrink-0 text-status-ok" /> : <AlertTriangle size={15} className="shrink-0 text-status-critical" />}
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <Metric label="Req" value={item.requestedAmount} />
                      <Metric label="Avail" value={item.availableAmount ?? "-"} tone={item.enough === true ? "ok" : item.enough === false ? "critical" : undefined} />
                      <Metric label="Miss" value={item.missingAmount ?? "-"} tone={item.missingAmount != null && item.missingAmount > 0 ? "critical" : undefined} />
                    </div>
                  </article>
                ))}
              </div>

              {filteredRows.length === 0 && (
                <div className="flex h-full items-center justify-center p-6">
                  <div className="border border-dashed border-border-default px-5 py-6 text-center font-mono text-[11px] uppercase tracking-widest text-txt-disabled">
                    No resources match the current filters
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-border-subtle bg-bg-secondary/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="h-10 border border-border-default bg-bg-secondary/50 px-5 font-mono text-[10px] font-bold uppercase tracking-widest text-txt-primary transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            CLOSE
          </button>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {requestStatus && requestStatus !== "P" && (
              <div className="flex h-10 items-center justify-center border border-border-default bg-bg-secondary px-3 font-mono text-[10px] uppercase tracking-widest text-txt-secondary">
                {statusMeta.label}
              </div>
            )}
            {onReject && requestStatus === "P" && (
              <button
                type="button"
                onClick={() => { onReject(); onClose(); }}
                disabled={isLoading}
                className="flex h-10 items-center justify-center gap-1.5 border border-status-critical/40 bg-status-critical/10 px-4 font-mono text-[10px] font-bold uppercase tracking-widest text-status-critical transition-colors hover:bg-status-critical/20 disabled:opacity-50"
              >
                <XCircle size={12} />
                REJECT
              </button>
            )}
            {onApprove && requestStatus === "P" && (
              <button
                type="button"
                onClick={() => { onApprove(); onClose(); }}
                disabled={isApproveDisabled}
                className="flex h-10 items-center justify-center gap-1.5 border border-status-ok/40 bg-status-ok/10 px-4 font-mono text-[10px] font-bold uppercase tracking-widest text-status-ok transition-colors hover:bg-status-ok/20 disabled:opacity-50"
              >
                <CheckCircle size={12} />
                APPROVE
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number | string; tone?: "ok" | "critical" }) {
  const toneClass = tone === "ok" ? "text-status-ok" : tone === "critical" ? "text-status-critical" : "text-txt-primary";
  return (
    <div className="min-w-0 border border-border-subtle bg-bg-tertiary/45 p-2">
      <div className="truncate font-mono text-[9px] uppercase tracking-widest text-txt-disabled">{label}</div>
      <div className={`mt-1 truncate font-mono text-[12px] font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}
