import { CheckCircle, Search, UserCheck, Users, X, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useCampRequestByIdQuery } from "../hooks/useCampRequestsQuery";
import { useRequestPersonsQuery } from "../hooks/useRequestPersonsQuery";
import { PersonSelector } from "./PersonSelector";

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  P: { label: "PENDING", color: "text-status-warning", bg: "bg-status-warning/10", border: "border-status-warning/30" },
  A: { label: "APPROVED", color: "text-status-ok", bg: "bg-status-ok/10", border: "border-status-ok/30" },
  R: { label: "REJECTED", color: "text-status-critical", bg: "bg-status-critical/10", border: "border-status-critical/30" },
};

interface PersonRequestDetailModalProps {
  requestId: number;
  onClose: () => void;
  onApprove?: (persons?: Array<{ person_id: number }>) => void;
  onReject?: () => void;
  requestStatus?: string;
  isLoading?: boolean;
  canSelectPeople?: boolean;
}

function getPersonLabel(person?: { name?: string; surname?: string } | null, personId?: number) {
  const label = [person?.name, person?.surname].filter(Boolean).join(" ").trim();
  return label || `Person #${personId ?? "-"}`;
}

export function PersonRequestDetailModal({
  requestId,
  onClose,
  onApprove,
  onReject,
  requestStatus,
  isLoading = false,
  canSelectPeople = false,
}: PersonRequestDetailModalProps) {
  const [search, setSearch] = useState("");
  const [draftPeople, setDraftPeople] = useState<Array<{ person_id: number }> | null>(null);
  const statusMeta = STATUS_META[requestStatus ?? "P"] ?? STATUS_META.P;
  const { data: request } = useCampRequestByIdQuery(requestId);
  const { data: requestPeople = [], isLoading: isPeopleLoading } = useRequestPersonsQuery(requestId);
  const isSelectable = canSelectPeople && requestStatus === "P";

  const requesterLabel = request?.origin_camp?.code || request?.origin_camp?.description || "UNRESOLVED CAMP";
  const providerLabel = request?.destination_camp?.code || request?.destination_camp?.description || "UNRESOLVED CAMP";

  const filteredPeople = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return requestPeople;
    return requestPeople.filter((item) => {
      const label = getPersonLabel(item.person, item.person_id).toLowerCase();
      return label.includes(normalizedSearch) || item.person?.dni?.toLowerCase().includes(normalizedSearch) || String(item.person_id).includes(normalizedSearch);
    });
  }, [requestPeople, search]);

  const selectedPeople = draftPeople ?? requestPeople.map((item) => ({ person_id: item.person_id }));

  function handleClose() {
    if (!isLoading) onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(event) => { if (event.target === event.currentTarget) handleClose(); }}
    >
      <div className="relative flex h-[100dvh] w-full flex-col border-border-strong bg-bg-tertiary/95 shadow-2xl sm:h-[min(92dvh,720px)] sm:max-w-5xl sm:border">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-bg-secondary/70 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <UserCheck size={16} className="shrink-0 text-accent" />
            <div className="min-w-0">
              <div className="truncate font-mono text-[11px] font-bold uppercase tracking-widest text-txt-primary">PEOPLE REQUEST DETAIL</div>
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
              aria-label="Close people request detail"
            >
              <X size={15} />
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)] lg:grid-rows-1">
          <aside className="border-b border-border-subtle bg-bg-secondary/35 p-4 lg:border-b-0 lg:border-r lg:p-5">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <Metric label="Requester" value={requesterLabel} />
              <Metric label="Provider" value={providerLabel} />
              <Metric label="People" value={isSelectable ? selectedPeople.length : requestPeople.length} tone="ok" />
            </div>
            <div className="mt-3 border border-border-subtle bg-bg-tertiary/45 p-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-txt-disabled">Approval effect</div>
                <div className="mt-1 font-mono text-[11px] font-bold uppercase tracking-widest text-txt-secondary">
                Shipment on approval
              </div>
            </div>
          </aside>

          <main className="flex min-h-0 flex-col overflow-hidden">
            <section className="shrink-0 border-b border-border-subtle bg-bg-tertiary/75 px-4 py-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-txt-primary">
                    {isSelectable ? "Select available people" : "People"}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-txt-muted">
                    {isSelectable ? `${selectedPeople.length} selected` : `${filteredPeople.length} of ${requestPeople.length}`}
                  </div>
                </div>
                {!isSelectable && (
                  <div className="flex h-9 min-w-0 items-center gap-2 border border-border-default bg-bg-secondary/50 px-3 sm:w-72">
                    <Search size={13} className="shrink-0 text-txt-muted" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search person"
                      className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-txt-primary outline-none placeholder:text-txt-disabled"
                    />
                  </div>
                )}
              </div>
            </section>

            <section className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
              {isSelectable ? (
                <PersonSelector
                  campId={request?.destination_camp_id ?? 0}
                  persons={selectedPeople}
                  onChange={setDraftPeople}
                />
              ) : isPeopleLoading ? (
                <EmptyPeople label="LOADING PEOPLE..." />
              ) : filteredPeople.length === 0 ? (
                <EmptyPeople label="NO PEOPLE MATCH THE CURRENT FILTER" />
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {filteredPeople.map((item) => (
                    <article key={item.id ?? item.person_id} className="min-w-0 border border-border-subtle bg-bg-secondary/35 p-3">
                      <div className="truncate font-mono text-[12px] font-bold text-txt-primary">
                        {getPersonLabel(item.person, item.person_id)}
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-txt-muted">
                        DNI {item.person?.dni || "-"} · Person #{item.person_id}
                      </div>
                    </article>
                  ))}
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
                onClick={() => { onApprove(isSelectable ? selectedPeople : undefined); onClose(); }}
                disabled={isLoading || (isSelectable ? selectedPeople.length === 0 : requestPeople.length === 0)}
                className="flex h-10 items-center justify-center gap-1.5 border border-status-ok/40 bg-status-ok/10 px-4 font-mono text-[10px] font-bold uppercase tracking-widest text-status-ok transition-colors hover:bg-status-ok/20 disabled:opacity-50"
              >
                <CheckCircle size={12} />
                APPROVE
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

function Metric({ label, value, tone }: { label: string; value: number | string; tone?: "ok" }) {
  return (
    <div className="min-w-0 border border-border-subtle bg-bg-tertiary/45 p-3">
      <div className="truncate font-mono text-[10px] uppercase tracking-widest text-txt-disabled">{label}</div>
      <div className={`mt-1 truncate font-mono text-[12px] font-bold ${tone === "ok" ? "text-status-ok" : "text-txt-primary"}`}>{value}</div>
    </div>
  );
}

function EmptyPeople({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-48 flex-col items-center justify-center gap-2 border border-dashed border-border-default p-6 text-center">
      <Users size={18} className="text-txt-disabled" />
      <p className="font-mono text-[10px] uppercase tracking-widest text-txt-disabled">{label}</p>
    </div>
  );
}
